package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class PipelineEvaluationResultRepository extends CrudRepository[PipelineEvaluationResultId, PipelineEvaluationResult, PipelineEvaluationResultTable](TableQuery[PipelineEvaluationResultTable]) {

}
