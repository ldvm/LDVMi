package model.component

import model.repository.VisualizerRepository
import scaldi.{Injectable, Injector}

class VisualizerComponentImpl(implicit inj: Injector)
  extends VisualizerComponent with Injectable {

  val repository = inject[VisualizerRepository]

}