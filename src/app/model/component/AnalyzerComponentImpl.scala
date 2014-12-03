package model.component

import model.repository.AnalyzerRepository
import scaldi.{Injectable, Injector}

class AnalyzerComponentImpl(implicit inj: Injector)
  extends AnalyzerComponent with Injectable {

  val repository = inject[AnalyzerRepository]

}