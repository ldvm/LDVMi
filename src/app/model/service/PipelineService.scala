package model.service

import akka.actor.ActorRef
import model.entity._
import model.repository.PipelineRepository
import play.api.db.slick._

trait PipelineService extends CrudService[PipelineId, Pipeline, PipelineTable, PipelineRepository] {

  def save(pipeline: model.dto.Pipeline)(implicit session: Session): PipelineId

  def save(pipelines: Seq[model.dto.Pipeline])(implicit session: Session): Seq[PipelineId] = {
    pipelines.map(save)
  }

  def discover(listener: ActorRef)(implicit session: Session): PipelineDiscoveryId

  def discoveryState(pipelineDiscoveryId: PipelineDiscoveryId)(implicit session: Session) : Option[PipelineDiscovery]

  def saveDiscoveryResults(pipelineDiscoveryId: PipelineDiscoveryId, pipelines: Seq[PartialPipeline])

}
