package model.repository

import model.entity._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class AnalyzerRepository extends CrudRepository[AnalyzerId, Analyzer, AnalyzerTable](TableQuery[AnalyzerTable])
