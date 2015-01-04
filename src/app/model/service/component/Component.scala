package model.service.component

import model.actor.CheckCompatibilityResponse
import model.entity.Descriptor
import play.api.db.slick.Session

import scala.concurrent.Future

trait Component {
  def check(context: BindingContext)(implicit session: Session)

  def checkIsCompatibleWith(descriptor: Descriptor)(implicit session: Session) : Future[CheckCompatibilityResponse]

  def checkCouldBeBoundWithComponentViaPort(component: Component, portUri: String)(implicit session: Session) : Future[Boolean]
}
