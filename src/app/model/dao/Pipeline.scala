package model.dao

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class PipelineId(id: Long) extends AnyVal with BaseId

object PipelineId extends IdCompanion[PipelineId]

case class Pipeline(
  id: Option[PipelineId],
  uri: String,
  bindingSetId: BindingSetId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity


class PipelineTable(tag: Tag) extends DescribedEntityTable[PipelineId, Pipeline](tag, "analyzers") {

  val bindingSets = TableQuery[BindingSetTable]

  def component = foreignKey("fk_pt_bst_id", bindingSetId, bindingSets)(_.id)

  def bindingSetId = column[BindingSetId]("binding_set_id", O.NotNull)

  def * = (id, uri, bindingSetId, createdUtc, modifiedUtc) <>(Pipeline.tupled, Pipeline.unapply _)
}