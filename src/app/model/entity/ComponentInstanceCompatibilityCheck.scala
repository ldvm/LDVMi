package model.entity

import java.util.UUID

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._


case class ComponentInstanceCompatibilityCheckId(id: Long) extends AnyVal with BaseId
object ComponentInstanceCompatibilityCheckId extends IdCompanion[ComponentInstanceCompatibilityCheckId]

case class ComponentInstanceCompatibilityCheck(
  id: Option[ComponentInstanceCompatibilityCheckId],
  componentInstanceId: ComponentInstanceId,
  dataPortBindingSetId: DataPortBindingSetId,
  isFinished: Boolean,
  isSuccess: Option[Boolean],
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[ComponentInstanceCompatibilityCheckId]


class ComponentInstanceCompatibilityCheckTable(tag: Tag) extends IdEntityTable[ComponentInstanceCompatibilityCheckId, ComponentInstanceCompatibilityCheck](tag, "component_instance_compatibility_checks") {

  def isFinished = column[Boolean]("is_finished", O.NotNull)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)

  def dataPortBindingSetId = column[DataPortBindingSetId]("data_port_binding_set_id", O.NotNull)

  def isSuccess = column[Option[Boolean]]("is_success")

  def * = (id.?, componentInstanceId, dataPortBindingSetId, isFinished, isSuccess, uuid, createdUtc, modifiedUtc) <> (ComponentInstanceCompatibilityCheck.tupled, ComponentInstanceCompatibilityCheck.unapply _)
}