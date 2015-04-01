package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class AnalyzerInstanceRepository extends CrudRepository[AnalyzerInstanceId, AnalyzerInstance, AnalyzerInstanceTable](TableQuery[AnalyzerInstanceTable])
