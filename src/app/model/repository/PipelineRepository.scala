package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class PipelineRepository extends CrudRepository[PipelineId, Pipeline, PipelineTable](TableQuery[PipelineTable])
