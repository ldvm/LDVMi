package model.dao

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class PipelineId(id: Long) extends AnyVal with BaseId

object PipelineId extends IdCompanion[PipelineId]

case class Pipeline(
  id: Option[PipelineId],
  bindingSetId: DataPortBindingSetId,
  uri: String,
  title: String,
  description: Option[String],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity


class PipelineTable(tag: Tag) extends DescribedEntityTable[PipelineId, Pipeline](tag, "pipelines") {

  val bindingSets = TableQuery[DataPortBindingSetTable]

  def bindingSet = foreignKey("fk_pt_bst_id", bindingSetId, bindingSets)(_.id)

  def bindingSetId = column[DataPortBindingSetId]("binding_set_id", O.NotNull)

  def uri = column[String]("uri", O.NotNull)

  def * = (id, bindingSetId, uri, title, description, createdUtc, modifiedUtc) <>(Pipeline.tupled, Pipeline.unapply _)
}