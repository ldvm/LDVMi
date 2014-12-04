package model.component

import model.entity.{Analyzer, AnalyzerId, AnalyzerTable}
import model.repository.AnalyzerRepository

trait AnalyzerService extends CrudService[AnalyzerId, Analyzer, AnalyzerTable, AnalyzerRepository]