package model.service

import akka.actor.{ActorRef, Props}
import model.entity._
import model.repository.PipelineRepository
import play.api.db.slick.Session

import scala.concurrent.Future

trait PipelineService extends CrudService[PipelineId, Pipeline, PipelineTable, PipelineRepository] {

  def save(pipeline: model.dto.Pipeline)(implicit session: Session): PipelineId

  def save(pipelines: Seq[model.dto.Pipeline])(implicit session: Session): Seq[PipelineId] = {
    pipelines.map(save)
  }

  def discover(listener: ActorRef)(implicit session: Session): PipelineDiscoveryId

  def discoveryState(pipelineDiscoveryId: PipelineDiscoveryId)(implicit session: Session) : Option[PipelineDiscovery]

  case class PortMapping(sourceComponentInstance: ComponentInstance, targetComponentInstance: ComponentInstance, viaPortUri: String) {
    override def toString = sourceComponentInstance.toString + "<-" + targetComponentInstance.toString
  }

  case class PartialPipeline(componentInstances: Seq[ComponentInstance], portMappings: Seq[PortMapping]) {
    override def toString =
      """
        components: """ + componentInstances.toString() +
        """
        portMappings: """ + portMappings.toString()
  }

}
