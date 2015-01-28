package model.service

import akka.actor.{ActorRef, Props}
import model.entity._
import model.repository.{ComponentInstanceRepository, PipelineRepository}
import play.api.db.slick._

import scala.slick.lifted.Ordered

trait ComponentInstanceService extends CrudService[ComponentInstanceId, ComponentInstance, ComponentInstanceTable, ComponentInstanceRepository] {

  def saveMembers(boundInstances: model.dto.BoundComponentInstances)(implicit session: Session) : DataPortBindingSetId

}
