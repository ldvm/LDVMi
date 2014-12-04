package model.component

import model.repository.AnalyzerRepository
import scaldi.{Injectable, Injector}

class AnalyzerServiceImpl(implicit inj: Injector) extends AnalyzerService with Injectable {

  val repository = inject[AnalyzerRepository]

}