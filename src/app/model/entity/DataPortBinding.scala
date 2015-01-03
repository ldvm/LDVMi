package model.entity

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

case class DataPortBindingId(id: Long) extends AnyVal with BaseId

object DataPortBindingId extends IdCompanion[DataPortBindingId]

case class DataPortBinding(
  id: Option[DataPortBindingId],
  bindingSetId: DataPortBindingSetId,
  sourceId: DataPortInstanceId,
  targetId: InputInstanceId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[DataPortBindingId] {

  def source(implicit session: Session) : DataPortInstance = {
    (for {
      d <- dataPortInstancesQuery if d.id === sourceId
    } yield d).first
  }

  def targetInputInstance(implicit session: Session) : InputInstance = {
    (for {
      i <- inputInstancesQuery if i.id === targetId
    } yield i).first
  }

}


class DataPortBindingTable(tag: Tag) extends IdEntityTable[DataPortBindingId, DataPortBinding](tag, "dataport_bindings") {

  def source = foreignKey("fk_dpbt_dpt_start_port_id", sourcePortId, dataPortInstancesQuery)(_.id)

  def sourcePortId = column[DataPortInstanceId]("start_port_id", O.NotNull)

  def bindingSet = foreignKey("fk_dpbt_dpbst_binding_set_id", bindingSetId, dataPortBindingSetsQuery)(_.id)

  def bindingSetId = column[DataPortBindingSetId]("binding_set_id", O.NotNull)

  def target = foreignKey("fk_dpbt_dpt_end_input_id", targetInputId, inputInstancesQuery)(_.id)

  def targetInputId = column[InputInstanceId]("end_input_id", O.NotNull)

  def * = (id.?, bindingSetId, sourcePortId, targetInputId, createdUtc, modifiedUtc) <>(DataPortBinding.tupled, DataPortBinding.unapply _)
}