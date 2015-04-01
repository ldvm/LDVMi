package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._


case class PipelineEvaluationQueryId(id: Long) extends AnyVal with BaseId
object PipelineEvaluationQueryId extends IdCompanion[PipelineEvaluationQueryId]

case class PipelineEvaluationQuery(
  id: Option[PipelineEvaluationQueryId],
  evaluationId: PipelineEvaluationId,
  token: String, 
  storedData: String,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[PipelineEvaluationQueryId]

class PipelineEvaluationQueryTable(tag: Tag) extends IdEntityTable[PipelineEvaluationQueryId, PipelineEvaluationQuery](tag, "pipeline_evaluation_queries") {

  def evaluation = foreignKey("fk_vqt_pet_evaluation_id", evaluationId, pipelineEvaluationQuery)(_.id)

  def evaluationId = column[PipelineEvaluationId]("evaluation_id")

  def data = column[String]("data", O.NotNull)

  def token = column[String]("token", O.NotNull)

  def * = (id.?, evaluationId, token, data, uuid, createdUtc, modifiedUtc) <>(PipelineEvaluationQuery.tupled, PipelineEvaluationQuery.unapply _)
}