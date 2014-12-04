package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class AnalyzerRepository extends CrudRepository[AnalyzerId, Analyzer, AnalyzerTable](TableQuery[AnalyzerTable])
