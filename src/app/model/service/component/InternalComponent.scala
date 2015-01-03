package model.service.component

import java.util.concurrent.TimeUnit

import akka.actor.Props
import akka.pattern.ask
import akka.util.Timeout
import model.actor.{CheckCompatibilityRequest, CheckCompatibilityResponse, RdfCompatibilityChecker, SparqlEndpointCompatibilityChecker}
import model.entity._
import model.rdf.Graph
import play.api.Play.current
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka

import scala.concurrent.ExecutionContext.Implicits.global

class InternalComponent(componentInstance: ComponentInstance) extends Component{

  implicit val timeout = Timeout(1, TimeUnit.MINUTES)

  def check(context: BindingContext)(implicit session: Session): Unit = {
    val features = componentInstance.component.features
    val featuresWithDescriptors = features.map { f => (f, f.descriptors)}

    featuresWithDescriptors.map {
      case (feature, descriptors) => {
        descriptors.map { descriptor =>
          val descriptorInputTemplate = descriptor.inputTemplate
          val componentForDescriptor = context(descriptorInputTemplate.dataPortTemplate.uri)
          // TODO: actors
          componentForDescriptor.checkIsCompatibleWith(descriptor)
        }
      }
    }
  }

  def checkIsCompatibleWith(descriptor: Descriptor)(implicit session: Session) = {
    val component = componentInstance.component
    val output = component.output
    val checker = output.map { o =>
      o.dataSample match {
        case Some(uri) => Akka.system.actorOf(Props(classOf[RdfCompatibilityChecker], uri))
        case None => Akka.system.actorOf(Props(classOf[SparqlEndpointCompatibilityChecker], Graph(componentInstance.configuration), Graph(component.defaultConfiguration)))
      }
    }.getOrElse {throw new UnsupportedOperationException}

    val promise = (checker ask CheckCompatibilityRequest(descriptor)).mapTo[CheckCompatibilityResponse]
    promise.onSuccess {
      case x => println((x, output.get.dataSample))
    }

    promise.onFailure {
      case t => println(("Failed.", output.get.dataSample))
    }
  }

  def checkCouldBeBoundWith(component: Component)(implicit session: Session) = {

  }

}

object InternalComponent {
  def apply(componentInstance: ComponentInstance): InternalComponent = {
    new InternalComponent(componentInstance)
  }

  def apply(specificComponentTemplate: SpecificComponentTemplate): InternalComponent = {
    new InternalComponent(ComponentInstance(None, "", "", None, specificComponentTemplate.componentTemplateId, None))
  }
}