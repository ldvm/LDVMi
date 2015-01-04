package model.service.component

import model.actor.CheckCompatibilityResponse
import model.entity.Descriptor
import play.api.db.slick.Session

import scala.concurrent.Future

class ExternalComponent extends Component {
  def check(context: BindingContext)(implicit session: Session) : Unit = ???

  def checkCouldBeBoundWithComponentViaPort(component: Component, portUri: String)(implicit session: Session) : Future[Boolean] = ???

  def checkIsCompatibleWith(descriptor: Descriptor)(implicit session: Session) : Future[CheckCompatibilityResponse] = ???
}
