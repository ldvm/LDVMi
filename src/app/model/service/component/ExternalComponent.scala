package model.service.component

import akka.actor.ActorRef
import model.actor.CheckCompatibilityResponse
import model.entity.{ComponentInstance, Descriptor}
import play.api.db.slick.Session

import scala.concurrent.Future

class ExternalComponent extends Component {

  def componentInstance : ComponentInstance = ???

  def check(context: BindingContext)(implicit session: Session) : Unit = ???

  def checkCouldBeBoundWithComponentViaPort(component: Component, portUri: String, logger: ActorRef)(implicit session: Session) : Future[Boolean] = ???

  def checkIsCompatibleWith(descriptor: Descriptor)(implicit session: Session) : Future[CheckCompatibilityResponse] = ???
}
