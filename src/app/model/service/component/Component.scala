package model.service.component

import akka.actor.{Props, ActorRef}
import model.actor.CheckCompatibilityResponse
import model.entity.{ComponentInstance, Descriptor}
import play.api.db.slick.Session

import scala.concurrent.Future

trait Component {

  def componentInstance: ComponentInstance

  def check(context: BindingContext, reporterProps: Props)(implicit session: Session)

  def checkIsCompatibleWith(descriptor: Descriptor, reporterProps: Props)(implicit session: Session) : Future[CheckCompatibilityResponse]

  def checkCouldBeBoundWithComponentViaPort(component: Component, portUri: String, reporterProps: Props)(implicit session: Session) : Future[Boolean]
}
