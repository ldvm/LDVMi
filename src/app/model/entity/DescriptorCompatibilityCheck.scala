package model.entity

import java.util.UUID

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._


case class DescriptorCompatibilityCheckId(id: Long) extends AnyVal with BaseId
object DescriptorCompatibilityCheckId extends IdCompanion[DescriptorCompatibilityCheckId]

case class DescriptorCompatibilityCheck(
  id: Option[DescriptorCompatibilityCheckId],
  descriptorId: DescriptorId,
  featureId: FeatureId,
  componentInstanceId: ComponentInstanceId,
  dataPortBindingSetId: DataPortBindingSetId,
  isFinished: Boolean,
  isSuccess: Option[Boolean],
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[DescriptorCompatibilityCheckId]


class DescriptorCompatibilityCheckTable(tag: Tag) extends IdEntityTable[DescriptorCompatibilityCheckId, DescriptorCompatibilityCheck](tag, "descriptor_compatibility_checks") {

  def descriptorId = column[DescriptorId]("descriptor_id", O.NotNull)

  def featureId = column[FeatureId]("feature_id", O.NotNull)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)

  def dataPortBindingSetId = column[DataPortBindingSetId]("data_port_binding_set_id", O.NotNull)

  def isFinished = column[Boolean]("is_finished", O.NotNull)

  def isSuccess = column[Option[Boolean]]("is_success")

  def * = (id.?, descriptorId, featureId, componentInstanceId, dataPortBindingSetId, isFinished, isSuccess, uuid, createdUtc, modifiedUtc) <> (DescriptorCompatibilityCheck.tupled, DescriptorCompatibilityCheck.unapply _)
}