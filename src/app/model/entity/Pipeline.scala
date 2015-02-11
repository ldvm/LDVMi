package model.entity

import java.util.UUID

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class PipelineId(id: Long) extends AnyVal with BaseId

object PipelineId extends IdCompanion[PipelineId]

case class Pipeline(
  id: Option[PipelineId],
  bindingSetId: DataPortBindingSetId,
  uri: String,
  title: String,
  description: Option[String],
  isTemporary: Boolean,
  pipelineDiscovery: Option[PipelineDiscoveryId],
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends DescribedEntity[PipelineId] {

  def bindingSet(implicit session: Session) : DataPortBindingSet = {
    (for {
      bs <- dataPortBindingSetsQuery if bs.id === bindingSetId
    } yield bs).first
  }

  def componentInstances(implicit session: Session) : Seq[ComponentInstance] = {
    (for {
      m <- componentInstanceMembershipQuery if m.bindingSetId === bindingSetId
      ci <- componentInstancesQuery if ci.id === m.componentInstanceId
    } yield ci).list
  }
}


class PipelineTable(tag: Tag) extends DescribedEntityTable[PipelineId, Pipeline](tag, "pipelines") {

  def bindingSet = foreignKey("fk_pt_bst_id", bindingSetId, bindingSetsQuery)(_.id)

  def bindingSetId = column[DataPortBindingSetId]("binding_set_id", O.NotNull)

  def uri = column[String]("uri", O.NotNull)

  def isTemporary = column[Boolean]("is_temporary", O.NotNull)

  def pipelineDiscoveryId = column[Option[PipelineDiscoveryId]]("pipeline_discovery_id")

  def pipelineDiscovery = foreignKey("pipeline_discovery", pipelineDiscoveryId, pipelineDiscoveriesQuery)(_.id)

  def * = (id.?, bindingSetId, uri, title, description, isTemporary, pipelineDiscoveryId, uuid, createdUtc, modifiedUtc) <>(Pipeline.tupled, Pipeline.unapply _)
}