package model.repository

import model.entity._

import scala.slick.lifted.TableQuery
import model.entity.CustomUnicornPlay.driver.simple._

class PipelineEvaluationRepository extends CrudRepository[PipelineEvaluationId, PipelineEvaluation, PipelineEvaluationTable](TableQuery[PipelineEvaluationTable])
