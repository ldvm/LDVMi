package model.entity

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

case class DataPortBindingId(id: Long) extends AnyVal with BaseId

object DataPortBindingId extends IdCompanion[DataPortBindingId]

case class DataPortBinding(
  id: Option[DataPortBindingId],
  startId: DataPortInstanceId,
  endId: InputInstanceId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[DataPortBindingId]


class DataPortBindingTable(tag: Tag) extends IdEntityTable[DataPortBindingId, DataPortBinding](tag, "dataport_bindings") {

  def start = foreignKey("fk_dpbt_dpt_start_port_id", startPortId, dataPortInstancesQuery)(_.id)

  def startPortId = column[DataPortInstanceId]("start_port_id", O.NotNull)

  def end = foreignKey("fk_dpbt_dpt_end_input_id", endInputId, inputInstancesQuery)(_.id)

  def endInputId = column[InputInstanceId]("end_input_id", O.NotNull)

  def * = (id.?, startPortId, endInputId, createdUtc, modifiedUtc) <>(DataPortBinding.tupled, DataPortBinding.unapply _)
}