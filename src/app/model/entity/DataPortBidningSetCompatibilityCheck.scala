package model.entity

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._


case class DataPortBindingSetCompatibilityCheckId(id: Long) extends AnyVal with BaseId
object DataPortBindingSetCompatibilityCheckId extends IdCompanion[DataPortBindingSetCompatibilityCheckId]

case class DataPortBindingSetCompatibilityCheck(
  id: Option[DataPortBindingSetCompatibilityCheckId],
  dataPortBindingSetId: DataPortBindingSetId,
  isFinished: Boolean,
  isSuccess: Option[Boolean],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[DataPortBindingSetCompatibilityCheckId]


class DataPortBindingSetCompatibilityCheckTable(tag: Tag) extends IdEntityTable[DataPortBindingSetCompatibilityCheckId, DataPortBindingSetCompatibilityCheck](tag, "data_port_binding_set_compatibility_checks") {

  def isFinished = column[Boolean]("is_finished", O.NotNull)

  def dataPortBindingSetId = column[DataPortBindingSetId]("data_port_binding_set_id", O.NotNull)

  def isSuccess = column[Option[Boolean]]("is_success")

  def * = (id.?, dataPortBindingSetId, isFinished, isSuccess, createdUtc, modifiedUtc) <> (DataPortBindingSetCompatibilityCheck.tupled, DataPortBindingSetCompatibilityCheck.unapply _)
}