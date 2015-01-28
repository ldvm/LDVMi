package model.entity

import java.util.UUID

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._


case class FeatureCompatibilityCheckId(id: Long) extends AnyVal with BaseId
object FeatureCompatibilityCheckId extends IdCompanion[FeatureCompatibilityCheckId]

case class FeatureCompatibilityCheck(
  id: Option[FeatureCompatibilityCheckId],
  featureId: FeatureId,
  componentInstanceId: ComponentInstanceId,
  dataPortBindingSetId: DataPortBindingSetId,
  isFinished: Boolean,
  isSuccess: Option[Boolean],
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[FeatureCompatibilityCheckId]


class FeatureCompatibilityCheckTable(tag: Tag) extends IdEntityTable[FeatureCompatibilityCheckId, FeatureCompatibilityCheck](tag, "feature_compatibility_checks") {

  def featureId = column[FeatureId]("feature_id", O.NotNull)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)

  def dataPortBindingSetId = column[DataPortBindingSetId]("data_port_binding_set_id", O.NotNull)

  def isFinished = column[Boolean]("is_finished", O.NotNull)

  def isSuccess = column[Option[Boolean]]("is_success")

  def * = (id.?, featureId, componentInstanceId, dataPortBindingSetId, isFinished, isSuccess, uuid, createdUtc, modifiedUtc) <> (FeatureCompatibilityCheck.tupled, FeatureCompatibilityCheck.unapply _)
}