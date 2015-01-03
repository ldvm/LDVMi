package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class AnalyzerTemplateRepository extends CrudRepository[AnalyzerTemplateId, AnalyzerTemplate, AnalyzerTemplateTable](TableQuery[AnalyzerTemplateTable])
