package model.service.component

import akka.actor.Props
import model.actor.{CheckCompatibilityRequest, SparqlEndpointCompatibilityChecker, RdfCompatibilityChecker, CheckCompatibilityResponse}
import model.entity.{Descriptor, ComponentInstance}
import model.rdf.Graph
import play.api.db.slick._
import play.api.libs.concurrent.Akka

import scala.concurrent.Future

class InternalTransformer(override val componentInstance: ComponentInstance, pluginFactory: PluginFactory, reporterProps: Props)
  extends InternalComponent(componentInstance, pluginFactory, reporterProps) {

  override def checkIsCompatibleWith(descriptor: Descriptor, reporterProps: Props)(implicit session: Session): Future[CheckCompatibilityResponse] = {
    val reporter = Akka.system.actorOf(reporterProps)

    previousComponent check transfromQuery(descriptor)

    /**val component = componentInstance.componentTemplate
    val output = component.outputTemplate
    val checker = output.map { o =>
      reporter ! "Checking compatibility of descriptor " + descriptor.title
      o.dataSample match {
        case Some(uri) => Akka.system.actorOf(Props(classOf[RdfCompatibilityChecker], uri))
        case None => Akka.system.actorOf(Props(classOf[SparqlEndpointCompatibilityChecker], Graph(componentInstance.configuration), Graph(component.defaultConfiguration), component.uri))
      }
    }.get

    val future = (checker ask CheckCompatibilityRequest(descriptor)).mapTo[CheckCompatibilityResponse]
    future.onSuccess {
      case r: CheckCompatibilityResponse => reporter ! r
    }

    future**/
  }

  override def checkCouldBeBoundWithComponentViaPort(componentToAsk: Component, portUri: String, reporterProps: Props)(implicit session: Session): Future[Boolean] = {
    Future {
      true
    }
  }

}
