package model.component

import model.repository.VisualizerRepository
import scaldi.{Injectable, Injector}

class VisualizerServiceImpl(implicit inj: Injector) extends VisualizerService with Injectable {

  val repository = inject[VisualizerRepository]

}