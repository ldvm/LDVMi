package model.service.component

import java.util.concurrent.TimeUnit

import akka.actor.Props
import akka.pattern.ask
import akka.util.Timeout
import model.actor.{CheckCompatibilityRequest, CheckCompatibilityResponse, RdfCompatibilityChecker, SparqlEndpointCompatibilityChecker}
import model.entity._
import model.rdf.Graph
import model.rdf.sparql.GenericSparqlEndpoint
import model.rdf.vocabulary.{DSPARQL, SD}
import model.service.{GraphStoreProtocol, SessionScoped}
import play.api.Play.current
import play.api.db
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka

import scala.collection.JavaConversions._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Future, Promise}


object EndpointConfig {
  def apply(ttl: Option[String]): Option[(String, Seq[String])] = {
    Graph(ttl).flatMap { g =>
      val maybeEndpointUrl = GenericSparqlEndpoint.getEndpointUrl(Seq(Some(g)))
      val graphUris = GenericSparqlEndpoint.getNamedGraphs(Seq(Some(g)))

      maybeEndpointUrl.map(e => (e, graphUris))
    }
  }
}

class InternalComponent(val componentInstance: ComponentInstance, pluginFactory: PluginFactory, reporterProps: Props) extends Component with SessionScoped {

  implicit val timeout = Timeout(1, TimeUnit.MINUTES)

  val props = ComponentActor.props(this, reporterProps)
  val actor = Akka.system.actorOf(props)

  def evaluate(dataReferences: Seq[DataReference]): Future[(String, Seq[String])] = {
    plugin.map{ p =>
      p.run(dataReferences, reporterProps)
    }.getOrElse {
      throw new NotImplementedError()
    }
  }

  def plugin: Option[AnalyzerPlugin] = withSession { implicit session =>
    pluginFactory.get(this, componentInstance.componentTemplate.uri)
  }

  def isDataSource: Boolean = withSession { implicit session =>
    componentInstance.componentTemplate.inputTemplates.isEmpty
  }

  def isVisualizer: Boolean = withSession { implicit session =>
    componentInstance.componentTemplate.outputTemplate.isEmpty
  }


  def dataSourceConfiguration: Option[(String, Seq[String])] = {
    withSession { implicit session =>
      lazy val instanceConfig = componentInstance.configuration
      lazy val templateConfig = componentInstance.componentTemplate.defaultConfiguration

      val instanceTuple = EndpointConfig(instanceConfig)

      instanceTuple match {
        case Some(x) => instanceTuple
        case None => EndpointConfig(templateConfig)
      }
    }
  }

  def check(context: BindingContext)(implicit session: Session) = {
    val features = componentInstance.componentTemplate.features
    val featuresWithDescriptors = features.map { f => (f, f.descriptors)}

    val eventualComponentInstanceCompatibility = featuresWithDescriptors.map {
      case (feature, descriptors) => {
        val eventualFeatureCompatibility = descriptors.flatMap { descriptor =>
          val descriptorInputTemplate = descriptor.inputTemplate

          val inputTemplateUri = descriptorInputTemplate.dataPortTemplate.uri
          val inputInstanceUri = componentInstance.inputInstances.find(_.dataPortInstance.dataPortTemplate.uri == inputTemplateUri).map(_.dataPortInstance.uri)

          val maybeComponentForDescriptor = inputInstanceUri.flatMap(context(_))
          maybeComponentForDescriptor.map { componentForDescriptor =>
            componentForDescriptor.checkIsCompatibleWith(descriptor, reporterProps)
          }
        }

        Future.sequence(eventualFeatureCompatibility)
      }
    }

    Future.sequence(eventualComponentInstanceCompatibility)
  }

  def requestDataFrom(remoteComponent: InternalComponent, myInputPortId: DataPortInstanceId)(implicit session: Session) = {
    val inputInstances = componentInstance.inputInstances
    val portInstanceUri = inputInstances.filter(_.dataPortInstanceId == myInputPortId).head.dataPortInstance.uri
    actor ! RequestBindingCommand(remoteComponent.actor, Bind(portInstanceUri))
  }

  def checkIsCompatibleWith(descriptor: Descriptor, reporterProps: Props)(implicit session: Session): Future[CheckCompatibilityResponse] = {
    val reporter = Akka.system.actorOf(reporterProps)

    val component = componentInstance.componentTemplate
    val output = component.outputTemplate
    val checker = output.map { o =>
      reporter ! "Checking compatibility of descriptor " + descriptor.title
      o.dataSample match {
        case Some(uri) => Akka.system.actorOf(Props(classOf[RdfCompatibilityChecker], uri))
        case None => Akka.system.actorOf(Props(classOf[SparqlEndpointCompatibilityChecker], Graph(componentInstance.configuration), Graph(component.defaultConfiguration), component.uri))
      }
    }.get

    val future = (checker ask CheckCompatibilityRequest(descriptor)).mapTo[CheckCompatibilityResponse]
    future.onSuccess{
      case r: CheckCompatibilityResponse => reporter ! r
    }

    future
  }

  def checkCouldBeBoundWithComponentViaPort(componentToAsk: Component, portUri: String, reporterProps: Props)(implicit session: Session): Future[Boolean] = {
    val p = Promise[Boolean]()
    val reporter = Akka.system.actorOf(reporterProps)

    reporter ! "Trying port <" + portUri + ">"

    val maybeInputTemplate = componentInstance.componentTemplate.inputTemplates.find(_.dataPortTemplate.uri == portUri)
    maybeInputTemplate.foreach { inputTemplate =>

      val eventualResponses = inputTemplate.descriptors(onlyMandatory = true).map { descriptor =>
        reporter ! "Port <" + portUri + "> compatibility with <" + componentToAsk.componentInstance.uri + ">"
        componentToAsk.checkIsCompatibleWith(descriptor, reporterProps)
      }

      eventualResponses.foreach(_.onFailure { case e => p.tryFailure(e)})
      Future.sequence(eventualResponses)
        .map { x => x.forall(_.isCompatible.getOrElse(false))}
        .foreach { x =>
        reporter ! "Port <" + portUri + "> compatibility with <" + componentToAsk.componentInstance.uri + "> result: " + x
        p.trySuccess(x)
      }
    }

    if(maybeInputTemplate.isEmpty) {
      p.tryFailure(new UnsupportedOperationException)
    }

    p.future
  }

}

object InternalComponent {

  val pluginFactory = new PluginFactory(new GraphStoreProtocol)

  def apply(componentInstance: ComponentInstance, reporterProps: Props): InternalComponent = {
    new InternalComponent(componentInstance, pluginFactory, reporterProps)
  }

  def apply(specificComponentTemplate: SpecificComponentTemplate, reporterProps: Props): InternalComponent = {
    implicit val session = db.slick.DB.createSession()
    val componentTemplate = specificComponentTemplate.componentTemplate
    session.close()
    new InternalComponent(
      ComponentInstance(None, componentTemplate.uri + "#instance", componentTemplate.title + " instance", None, specificComponentTemplate.componentTemplateId, None),
      pluginFactory,
      reporterProps
    )
  }
}