package model.entity

import java.util.UUID

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

import scala.slick.lifted.Tag

case class ComponentInstanceMembershipId(id: Long) extends AnyVal with BaseId

object ComponentInstanceMembershipId extends IdCompanion[ComponentInstanceMembershipId]

case class ComponentInstanceMembership(
  id: Option[ComponentInstanceMembershipId],
  bindingSetId: DataPortBindingSetId,
  componentInstanceId: ComponentInstanceId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[ComponentInstanceMembershipId] {

}

class ComponentInstanceMembershipTable(tag: Tag) extends IdEntityTable[ComponentInstanceMembershipId, ComponentInstanceMembership](tag, "component_instances_membership") {

  def * = (id.?, bindingSetId, componentInstanceId, uuid, createdUtc, modifiedUtc) <>(ComponentInstanceMembership.tupled, ComponentInstanceMembership.unapply _)

  def componentInstance = foreignKey("fk_cimt_cit_component_id", componentInstanceId, componentInstancesQuery)(_.id)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)

  def bindingSet = foreignKey("fk_cimt_dpbst_component_id", bindingSetId, bindingSetsQuery)(_.id)

  def bindingSetId = column[DataPortBindingSetId]("data_port_binding_set_id", O.NotNull)

}



