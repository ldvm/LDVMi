package model.service.component

import java.util.concurrent.TimeUnit

import akka.actor.Props
import akka.pattern.ask
import akka.util.Timeout
import model.actor.{CheckCompatibilityRequest, CheckCompatibilityResponse, RdfCompatibilityChecker, SparqlEndpointCompatibilityChecker}
import model.entity._
import model.rdf.Graph
import model.service.Connected
import play.api.Play.current
import play.api.db
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Future, Promise}

class InternalComponent(val componentInstance: ComponentInstance) extends Component with Connected {

  implicit val timeout = Timeout(1, TimeUnit.MINUTES)

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