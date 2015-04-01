package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class PipelineEvaluationQueryRepository extends CrudRepository[PipelineEvaluationQueryId, PipelineEvaluationQuery, PipelineEvaluationQueryTable](TableQuery[PipelineEvaluationQueryTable]) {

  def findByToken(token: String)(implicit session: Session) : Option[PipelineEvaluationQuery] = {
    (for {
      q <- query if q.token === token
    } yield q).firstOption
  }

}
