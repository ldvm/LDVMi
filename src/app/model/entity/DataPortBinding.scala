package model.entity

import java.util.UUID

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

case class DataPortBindingId(id: Long) extends AnyVal with BaseId

object DataPortBindingId extends IdCompanion[DataPortBindingId]

case class DataPortBinding(
  id: Option[DataPortBindingId],
  bindingSetId: DataPortBindingSetId,
  sourceId: DataPortInstanceId,
  targetId: DataPortInstanceId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[DataPortBindingId] {

  def source(implicit session: Session) : DataPortInstance = endpoint(sourceId)

  def target(implicit session: Session) : DataPortInstance = endpoint(targetId)

  def targetInputInstance(implicit session: Session) : Option[InputInstance] = {
    (for {
      inputInstance <- inputInstancesQuery if inputInstance.dataPortInstanceId === targetId
    } yield inputInstance).firstOption
  }

  private def endpoint(endpointId: DataPortInstanceId)(implicit session: Session) : DataPortInstance = {
    (for {
      d <- dataPortInstancesQuery if d.id === endpointId
    } yield d).first
  }

}


class DataPortBindingTable(tag: Tag) extends IdEntityTable[DataPortBindingId, DataPortBinding](tag, "dataport_bindings") {

  def source = foreignKey("fk_dpbt_dpt_source_port_id", sourcePortId, dataPortInstancesQuery)(_.id)

  def sourcePortId = column[DataPortInstanceId]("source_data_port_id", O.NotNull)

  def bindingSet = foreignKey("fk_dpbt_dpbst_binding_set_id", bindingSetId, dataPortBindingSetsQuery)(_.id)

  def bindingSetId = column[DataPortBindingSetId]("binding_set_id", O.NotNull)

  def target = foreignKey("fk_dpbt_dpt_target_data_port_id", targetPortId, dataPortInstancesQuery)(_.id)

  def targetPortId = column[DataPortInstanceId]("target_data_port_id", O.NotNull)

  def * = (id.?, bindingSetId, sourcePortId, targetPortId, uuid, createdUtc, modifiedUtc) <>(DataPortBinding.tupled, DataPortBinding.unapply _)
}