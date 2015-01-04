package model.service.component

import java.util.concurrent.TimeUnit

import akka.actor.Props
import akka.pattern.ask
import akka.util.Timeout
import model.actor.{CheckCompatibilityRequest, CheckCompatibilityResponse, RdfCompatibilityChecker, SparqlEndpointCompatibilityChecker}
import model.entity._
import model.rdf.Graph
import play.api.Play.current
import play.api.db
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Future, Promise}

class InternalComponent(val componentInstance: ComponentInstance) extends Component {

  implicit val timeout = Timeout(1, TimeUnit.MINUTES)

  def check(context: BindingContext)(implicit session: Session): Unit = {
    val features = componentInstance.componentTemplate.features
    val featuresWithDescriptors = features.map { f => (f, f.descriptors)}

    featuresWithDescriptors.map {
      case (feature, descriptors) => {
        descriptors.map { descriptor =>
          val descriptorInputTemplate = descriptor.inputTemplate
          val componentForDescriptor = context(descriptorInputTemplate.dataPortTemplate.uri)
          componentForDescriptor.checkIsCompatibleWith(descriptor)
        }
      }
    }
  }

  def checkIsCompatibleWith(descriptor: Descriptor)(implicit session: Session): Future[CheckCompatibilityResponse] = {
    val component = componentInstance.componentTemplate
    val output = component.outputTemplate
    val checker = output.map { o =>
      o.dataSample match {
        case Some(uri) => Akka.system.actorOf(Props(classOf[RdfCompatibilityChecker], uri))
        case None => Akka.system.actorOf(Props(classOf[SparqlEndpointCompatibilityChecker], Graph(componentInstance.configuration), Graph(component.defaultConfiguration)))
      }
    }.getOrElse {
      println("dead")
      throw new UnsupportedOperationException
    }

    (checker ask CheckCompatibilityRequest(descriptor)).mapTo[CheckCompatibilityResponse]
  }

  def checkCouldBeBoundWithComponentViaPort(componentToAsk: Component, portUri: String)(implicit session: Session): Future[Boolean] = {
    val p = Promise[Boolean]()

    val maybeInputTemplate = componentInstance.componentTemplate.inputTemplates.find(_.dataPortTemplate.uri == portUri)
    maybeInputTemplate.map { inputTemplate =>

      val eventualResponses = inputTemplate.descriptors(onlyMandatory = true).map { descriptor =>
        componentToAsk.checkIsCompatibleWith(descriptor)
      }

      eventualResponses.foreach(_.onFailure { case e => p.tryFailure(e)})
      Future.sequence(eventualResponses)
        .map(_.forall(_.isCompatible.getOrElse(false)))
        .foreach(p.trySuccess)
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
    new InternalComponent(ComponentInstance(None, componentTemplate.uri+"#instance", componentTemplate.title+" instance", None, specificComponentTemplate.componentTemplateId, None))
  }
}