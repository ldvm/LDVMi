package model.service.component

import java.util.concurrent.TimeUnit

import akka.actor.Props
import akka.pattern.ask
import akka.util.Timeout
import model.actor.{CheckCompatibilityRequest, CheckCompatibilityResponse, RdfCompatibilityChecker, SparqlEndpointCompatibilityChecker}
import model.entity.{ComponentInstance, DataPortBindingSet, Descriptor}
import model.rdf.Graph
import play.api.Play.current
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka
import scala.concurrent.ExecutionContext.Implicits.global

class InternalComponentInstance(componentInstance: ComponentInstance) {

  implicit val timeout = Timeout(1, TimeUnit.MINUTES)

  def check(bindingSet: DataPortBindingSet)(implicit session: Session): Unit = {
    val features = componentInstance.component.features
    val featuresWithDescriptors = features.map { f => (f, f.descriptors)}

    featuresWithDescriptors.map {
      case (feature, descriptors) => {
        descriptors.map { descriptor =>
          val descriptorInput = descriptor.input
          val descriptorSourcePort = bindingSet.bindings.find(_.target.inputId == descriptorInput.id.get)
          descriptorSourcePort.map { dataPort =>
            val boundComponentInstance = dataPort.source.componentInstance

            InternalComponentInstance(boundComponentInstance).isCompatibleWith(descriptor)
          }
        }
      }
    }
  }

  def isCompatibleWith(descriptor: Descriptor)(implicit session: Session) = {
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

}

object InternalComponentInstance {
  def apply(componentInstance: ComponentInstance): InternalComponentInstance = {
    new InternalComponentInstance(componentInstance)
  }
}