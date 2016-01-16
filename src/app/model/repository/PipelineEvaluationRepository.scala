package model.repository

import model.entity._
import utils.PaginationInfo

import scala.slick.lifted.TableQuery
import model.entity.CustomUnicornPlay.driver.simple._

class PipelineEvaluationRepository extends CrudRepository[PipelineEvaluationId, PipelineEvaluation, PipelineEvaluationTable](TableQuery[PipelineEvaluationTable]) {
  def lastEvaluationsOf(pipelineId: PipelineId, paginationInfo: PaginationInfo)(implicit session: Session) = {
    (for {
      q <- query if q.pipelineId === pipelineId
    } yield q).sortBy(e => (e.modifiedUtc.desc, e.createdUtc.desc)).drop(paginationInfo.skipCount).take(paginationInfo.pageSize).list
  }
}
