package model.service

import model.entity._
import model.repository.PipelineRepository
import model.dto
import play.api.db.slick.Session

trait PipelineService extends CrudService[PipelineId, Pipeline, PipelineTable, PipelineRepository] {

  def save(pipeline: model.dto.Pipeline)(implicit session: Session) : PipelineId

  def save(pipelines: Seq[model.dto.Pipeline])(implicit session: Session): Seq[PipelineId] = {
    pipelines.map(save)
  }

}
