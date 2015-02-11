package model.entity

import java.util.UUID

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._


case class PipelineEvaluationId(id: Long) extends AnyVal with BaseId
object PipelineEvaluationId extends IdCompanion[PipelineEvaluationId]

case class PipelineEvaluation(
  id: Option[PipelineEvaluationId],
  isFinished: Boolean,
  isSuccess: Option[Boolean],
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[PipelineEvaluationId]


class PipelineEvaluationTable(tag: Tag) extends IdEntityTable[PipelineEvaluationId, PipelineEvaluation](tag, "pipeline_evaluation") {

  def isFinished = column[Boolean]("is_finished", O.NotNull)

  def isSuccess = column[Option[Boolean]]("is_success")

  def * = (id.?, isFinished, isSuccess, uuid, createdUtc, modifiedUtc) <> (PipelineEvaluation.tupled, PipelineEvaluation.unapply _)
}