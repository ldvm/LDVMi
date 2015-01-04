package model.service

import model.entity._
import model.repository.PipelineRepository
import play.api.db.slick.Session

import scala.concurrent.Future

trait PipelineService extends CrudService[PipelineId, Pipeline, PipelineTable, PipelineRepository] {

  def save(pipeline: model.dto.Pipeline)(implicit session: Session): PipelineId

  def save(pipelines: Seq[model.dto.Pipeline])(implicit session: Session): Seq[PipelineId] = {
    pipelines.map(save)
  }

  def construct(implicit session: Session): Future[Seq[PartialPipeline]]

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
