package model.entity

import java.util.UUID

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

case class NestedDataPortBindingId(id: Long) extends AnyVal with BaseId

object NestedDataPortBindingId extends IdCompanion[NestedDataPortBindingId]

case class NestedDataPortBinding(
  id: Option[NestedDataPortBindingId],
  bindingSetId: DataPortBindingSetId,
  sourcePortTemplateId: Option[DataPortTemplateId] = None,
  targetPortTemplateId: Option[DataPortTemplateId] = None,
  sourcePortInstanceId: Option[DataPortInstanceId] = None,
  targetPortInstanceId: Option[DataPortInstanceId] = None,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[NestedDataPortBindingId] {

  def sourceInstance(implicit session: Session) : Option[DataPortInstance] = sourcePortInstanceId.map(instanceEndpoint)

  def targetInstance(implicit session: Session) : Option[DataPortInstance] = targetPortInstanceId.map(instanceEndpoint)

  def sourceTemplate(implicit session: Session) : Option[DataPortTemplate] = sourcePortTemplateId.map(instanceTemplate)

  def targetTemplate(implicit session: Session) : Option[DataPortTemplate] = targetPortTemplateId.map(instanceTemplate)

  private def instanceEndpoint(endpointId: DataPortInstanceId)(implicit session: Session) : DataPortInstance = {
    (for {
      d <- dataPortInstancesQuery if d.id === endpointId
    } yield d).first
  }

  private def instanceTemplate(endpointId: DataPortTemplateId)(implicit session: Session) : DataPortTemplate = {
    (for {
      d <- dataPortTemplatesQuery if d.id === endpointId
    } yield d).first
  }
}


class NestedDataPortBindingTable(tag: Tag) extends IdEntityTable[NestedDataPortBindingId, NestedDataPortBinding](tag, "nested_dataport_bindings") {

  def sourcePortTemplateId = column[Option[DataPortTemplateId]]("source_data_port_template_id")
  def sourcePortInstanceId = column[Option[DataPortInstanceId]]("source_data_port_instance_id")
  def targetPortTemplateId = column[Option[DataPortTemplateId]]("target_data_port_template_id")
  def targetPortInstanceId = column[Option[DataPortInstanceId]]("target_data_port_instance_id")

  def bindingSet = foreignKey(fkName("dpbst_binding_set_id"), bindingSetId, dataPortBindingSetsQuery)(_.id)
  def bindingSetId = column[DataPortBindingSetId]("binding_set_id", O.NotNull)

  def sourceInstance = foreignKey(fkName("dpit_source_port_instance_id"), sourcePortInstanceId, dataPortInstancesQuery)(_.id)
  def targetInstance = foreignKey(fkName("dpit_target_port_instance_id"), targetPortInstanceId, dataPortInstancesQuery)(_.id)
  def sourceTemplate = foreignKey(fkName("dptt_source_port_template_id"), sourcePortTemplateId, dataPortTemplatesQuery)(_.id)
  def targetTemplate = foreignKey(fkName("dptt_target_port_template_id"), targetPortTemplateId, dataPortTemplatesQuery)(_.id)

  def * = (id.?, bindingSetId, sourcePortTemplateId, targetPortTemplateId, sourcePortInstanceId, targetPortInstanceId, uuid, createdUtc, modifiedUtc) <>(NestedDataPortBinding.tupled, NestedDataPortBinding.unapply _)
}