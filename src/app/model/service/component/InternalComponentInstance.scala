package model.service.component

import java.util.concurrent.TimeUnit

import akka.actor.Props
import akka.util.Timeout
import model.actor.{CheckCompatibilityResponse, CheckCompatibilityRequest, SparqlEndpointCompatibilityChecker, RdfCompatibilityChecker}
import model.entity.{Descriptor, DataPortBindingSet, ComponentInstance}
import model.rdf.Graph
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka
import play.api.Play.current
import akka.pattern.ask

class InternalComponentInstance(componentInstance: ComponentInstance) {

  implicit val timeout = Timeout(5, TimeUnit.SECONDS)

  def check(bindingSet: DataPortBindingSet)(implicit session: Session): Unit = {
    val features = componentInstance.component.features
    val featuresWithDescriptors = features.map{ f => (f, f.descriptors) }

    featuresWithDescriptors.map {
      case (feature, descriptors) => {
        descriptors.map { descriptor =>
          val descriptorInput = descriptor.input
          val descriptorSourcePort = bindingSet.bindings.find(_.targetId == descriptorInput.id)
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
        case Some(rdf) => Akka.system.actorOf(Props(classOf[RdfCompatibilityChecker], Graph(rdf)))
        case None => Akka.system.actorOf(Props(classOf[SparqlEndpointCompatibilityChecker], Graph(componentInstance.configuration), Graph(component.defaultConfiguration)))
      }
    }.getOrElse{ throw new UnsupportedOperationException }

    (checker ask CheckCompatibilityRequest(descriptor)).mapTo[CheckCompatibilityResponse]
  }

}

object InternalComponentInstance {
  def apply(componentInstance: ComponentInstance): InternalComponentInstance = {
    new InternalComponentInstance(componentInstance)
  }
}