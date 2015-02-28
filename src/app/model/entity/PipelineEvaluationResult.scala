package model.entity

import java.util.UUID

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._


case class PipelineEvaluationResultId(id: Long) extends AnyVal with BaseId
object PipelineEvaluationResultId extends IdCompanion[PipelineEvaluationResultId]

case class PipelineEvaluationResult(
  id: Option[PipelineEvaluationResultId],
  pipelineEvaluationId: PipelineEvaluationId,
  visualizerId: ComponentTemplateId,
  portId: DataPortTemplateId,
  endpointUrl: String,
  graphUri: Option[String],
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[PipelineEvaluationResultId]


class PipelineEvaluationResultTable(tag: Tag) extends IdEntityTable[PipelineEvaluationResultId, PipelineEvaluationResult](tag, "pipeline_evaluation_result") {

  def endpointUrl = column[String]("endpoint_url", O.NotNull)

  def graphUri = column[Option[String]]("graph_uri")

  def pipelineEvaluationId = column[PipelineEvaluationId]("pipeline_evaluation_id")

  def pipelineEvaluation = foreignKey("pipeline_evaluation", pipelineEvaluationId, pipelineEvaluationsQuery)(_.id)

  def visualizerId = column[ComponentTemplateId]("component_template_id")

  def visualizer = foreignKey("visualizer", visualizerId, componentTemplatesQuery)(_.id)

  def portId = column[DataPortTemplateId]("port_id")

  def port = foreignKey("port", portId, dataPortTemplatesQuery)(_.id)

  def * = (id.?, pipelineEvaluationId, visualizerId, portId, endpointUrl, graphUri, uuid, createdUtc, modifiedUtc) <> (PipelineEvaluationResult.tupled, PipelineEvaluationResult.unapply _)
}