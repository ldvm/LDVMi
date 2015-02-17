package model.service.component

import java.util.concurrent.TimeUnit

import akka.actor.{ActorRef, Props}
import akka.pattern.ask
import akka.util.Timeout
import com.hp.hpl.jena.vocabulary.RDF
import model.actor.{CheckCompatibilityRequest, CheckCompatibilityResponse, RdfCompatibilityChecker, SparqlEndpointCompatibilityChecker}
import model.entity._
import model.rdf.Graph
import model.rdf.vocabulary.{DSPARQL, SD}
import model.service.Connected
import play.api.Play.current
import play.api.db
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka

import scala.collection.JavaConversions._
import scala.collection.mutable
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Future, Promise}


object EndpointConfig {
  def apply(ttl: Option[String]): Option[(String, Option[String])] = {
    Graph(ttl).flatMap { g =>
      val jenaModel = g.jenaModel
      val configs = jenaModel.listSubjectsWithProperty(RDF.`type`, DSPARQL.SparqlEndpointDataSourceConfiguration).toList
      configs.flatMap { c =>
        val services = c.asResource().listProperties(DSPARQL.service).toList
        services.map { s =>
          val endpoints = s.getObject.asResource().listProperties(SD.endpoint).toList
          val endpointUris = endpoints.map { e =>
            e.getObject.asResource.getURI
          }
          endpointUris.map{ e => (e, None) }
        }.head
      }.headOption
    }
  }
}

class InternalComponent(val componentInstance: ComponentInstance) extends Component with Connected {

  implicit val timeout = Timeout(1, TimeUnit.MINUTES)

  val props = ComponentActor.props(this)
  val actor = Akka.system.actorOf(props)

  def evaluate(dataReferences: Seq[DataReference]): Future[(String, Option[String])] = plugin.run(dataReferences)

  def plugin: AnalyzerPlugin = {
    withSession { implicit session =>
      println(componentInstance, componentInstance.componentTemplate)
      if (componentInstance.componentTemplate.nestedBindingSetId.isDefined) {

        new NestedPipelinePlugin(this)

      } else {
        componentInstance.componentTemplate.uri match {
          case "http://linked.opendata.cz/resource/ldvm/analyzer/sparql/SparqlAnalyzerTemplate" => new SparqlPlugin(this)
          case "http://linked.opendata.cz/resource/ldvm/analyzer/union/UnionAnalyzerTemplate" => new UnionPlugin(this)
          case x => {
            println(x+" is not implemented")
            throw new NotImplementedError()
          }
        }
      }
    }
  }

  def isDataSource: Boolean = withSession { implicit session =>
    componentInstance.componentTemplate.inputTemplates.isEmpty
  }

  def isVisualizer: Boolean = withSession { implicit session =>
    componentInstance.componentTemplate.outputTemplate.isEmpty
  }


  def dataSourceConfiguration: Option[(String, Option[String])] = {
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

  def check(context: BindingContext, reporterProps: Props)(implicit session: Session) = {
    val features = componentInstance.componentTemplate.features
    val featuresWithDescriptors = features.map { f => (f, f.descriptors)}

    val reporter = Akka.system.actorOf(reporterProps)

    val eventualComponentInstanceCompatibility = featuresWithDescriptors.map {
      case (feature, descriptors) => {
        val eventualFeatureCompatibility = descriptors.map { descriptor =>
          val descriptorInputTemplate = descriptor.inputTemplate
          val componentForDescriptor = context(descriptorInputTemplate.dataPortTemplate.uri)
          val eventualDescriptorCompatibility = componentForDescriptor.checkIsCompatibleWith(descriptor, reporterProps)

          eventualDescriptorCompatibility.onSuccess {
            case r => reporter ! r
          }

          eventualDescriptorCompatibility.onFailure {
            case e => reporter ! e.getMessage
          }

          eventualDescriptorCompatibility
        }

        Future.sequence(eventualFeatureCompatibility)
      }
    }

    Future.sequence(eventualComponentInstanceCompatibility)
  }

  def requestDataFrom(remoteComponent: InternalComponent, myInputPortId: DataPortInstanceId)(implicit session: Session) = {
    val inputInstances = componentInstance.inputInstances
    val portInstanceUri = inputInstances.filter(_.dataPortInstanceId == myInputPortId).head.dataPortInstance.uri
    actor ! RequestBinding(remoteComponent.actor, BindMessage(portInstanceUri))
  }

  def checkIsCompatibleWith(descriptor: Descriptor, reporterProps: Props)(implicit session: Session): Future[CheckCompatibilityResponse] = {
    val reporter = Akka.system.actorOf(reporterProps)

    val component = componentInstance.componentTemplate
    val output = component.outputTemplate
    val checker = output.map { o =>
      reporter ! "Checking compatibility of descriptor " + descriptor.title
      o.dataSample match {
        case Some(uri) => Akka.system.actorOf(Props(classOf[RdfCompatibilityChecker], uri))
        case None => Akka.system.actorOf(Props(classOf[SparqlEndpointCompatibilityChecker], Graph(componentInstance.configuration), Graph(component.defaultConfiguration)))
      }
    }.get

    (checker ask CheckCompatibilityRequest(descriptor)).mapTo[CheckCompatibilityResponse]
  }

  def checkCouldBeBoundWithComponentViaPort(componentToAsk: Component, portUri: String, reporterProps: Props)(implicit session: Session): Future[Boolean] = {
    val p = Promise[Boolean]()
    val reporter = Akka.system.actorOf(reporterProps)

    reporter ! "Trying port <" + portUri + ">"

    val maybeInputTemplate = componentInstance.componentTemplate.inputTemplates.find(_.dataPortTemplate.uri == portUri)
    maybeInputTemplate.map { inputTemplate =>

      val eventualResponses = inputTemplate.descriptors(onlyMandatory = true).map { descriptor =>
        componentToAsk.checkIsCompatibleWith(descriptor, reporterProps)
      }

      eventualResponses.foreach(_.onFailure { case e => p.tryFailure(e)})
      Future.sequence(eventualResponses)
        .map { x => x.forall(_.isCompatible.getOrElse(false))}
        .foreach { x =>
        reporter ! "Port <" + portUri + "> compatibility with <" + componentToAsk.componentInstance.uri + "> result: " + x
        p.trySuccess(x)
      }
    }.getOrElse {
      p.tryFailure(new UnsupportedOperationException)
    }

    p.future
  }

}

object InternalComponent {
  def apply(componentInstance: ComponentInstance): InternalComponent = {
    new InternalComponent(componentInstance)
  }

  def apply(specificComponentTemplate: SpecificComponentTemplate): InternalComponent = {
    implicit val session = db.slick.DB.createSession()
    val componentTemplate = specificComponentTemplate.componentTemplate
    session.close()
    new InternalComponent(ComponentInstance(None, componentTemplate.uri + "#instance", componentTemplate.title + " instance", None, specificComponentTemplate.componentTemplateId, None))
  }
}