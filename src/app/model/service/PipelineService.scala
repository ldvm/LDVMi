package model.service

import akka.actor.{Props, ActorRef}
import model.entity._
import model.repository.PipelineRepository
import play.api.db.slick._

import scala.slick.lifted.Ordered

trait PipelineService extends CrudService[PipelineId, Pipeline, PipelineTable, PipelineRepository] {

  def save(pipeline: model.dto.BoundComponentInstances)(implicit session: Session): PipelineId

  def save(pipelines: Seq[model.dto.BoundComponentInstances])(implicit session: Session): Seq[PipelineId] = {
    pipelines.map(save)
  }

  def findPaginatedFiltered[T <% Ordered](skip: Int = 0, take: Int = 50, pipelineDiscoveryId: Option[PipelineDiscoveryId] = None)
    (ordering: PipelineTable => T = { e: PipelineTable => (e.modifiedUtc.desc, e.createdUtc.desc) })
    (implicit session: Session): Seq[Pipeline]

  def discover(reporterProps: Props)(implicit session: Session): PipelineDiscoveryId

  def evaluate(pipelineId: PipelineId)(reporterProps: Props)(implicit session: Session): Option[PipelineEvaluationId]

  def discoveryState(pipelineDiscoveryId: PipelineDiscoveryId)(implicit session: Session) : Option[PipelineDiscovery]

  def saveDiscoveryResults(pipelineDiscoveryId: PipelineDiscoveryId, pipelines: Seq[PartialPipeline], jsLogger: ActorRef)

}
