package model.service

import akka.actor.{ActorRef, Props}
import model.entity._
import model.repository.PipelineRepository
import play.api.db.slick._
import utils.PaginationInfo

import scala.slick.lifted.Ordered

trait PipelineService extends CrudService[PipelineId, Pipeline, PipelineTable, PipelineRepository] {

  def save(pipeline: model.dto.BoundComponentInstances)(implicit session: Session): PipelineId

  def save(pipelines: Seq[model.dto.BoundComponentInstances])(implicit session: Session): Seq[PipelineId] = {
    pipelines.map(save)
  }

  def findPaginatedFiltered[T <% Ordered](
    paginationInfo: PaginationInfo,
    pipelineDiscoveryId: Option[PipelineDiscoveryId] = None,
    visualizerId: Option[ComponentTemplateId] = None
    )
    (ordering: PipelineTable => T = { e: PipelineTable => (e.modifiedUtc.desc, e.createdUtc.desc) })
    (implicit session: Session): Seq[Pipeline]

  def discover(reporterProps: Props, dataSourceTemplateId: Option[Long], combine: Boolean = false)(implicit session: Session): PipelineDiscoveryId

  def evaluate(pipelineId: PipelineId)(reporterProps: Props)(implicit session: Session): Option[PipelineEvaluationId]

  def discoveryState(pipelineDiscoveryId: PipelineDiscoveryId)(implicit session: Session): Option[PipelineDiscovery]

  def saveDiscoveryResults(pipelineDiscoveryId: PipelineDiscoveryId, pipelines: Seq[PartialPipeline], jsLogger: ActorRef)

  def lastEvaluations(pipelineId: PipelineId, paginationInfo: PaginationInfo)(implicit session: Session): Seq[PipelineEvaluation]

  def findEvaluationById(evaluationId: PipelineEvaluationId)(implicit session: Session): Option[PipelineEvaluation]

  def setEvaluationQuery(token: String, query: PipelineEvaluationQuery)(implicit session: Session) : PipelineEvaluationQueryId

  def findQueryByIdAndToken(id: PipelineEvaluationId, token: String)(implicit session: Session): Option[PipelineEvaluationQuery]

  def modifyEvaluationQuery(id: PipelineEvaluationId, token: String, dimensionUri: String, valueUri: String)(implicit session: Session): Option[String]

}
