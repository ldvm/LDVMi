package model.component

import model.entity.{Analyzer, AnalyzerId, AnalyzerTable}
import model.repository.AnalyzerRepository

trait AnalyzerComponent extends CrudComponent[AnalyzerId, Analyzer, AnalyzerTable, AnalyzerRepository] {

}
