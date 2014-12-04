package model.component

import model.repository.PipelineRepository
import scaldi.{Injectable, Injector}

class PipelineServiceImpl(implicit inj: Injector) extends PipelineService with Injectable {

  val repository = inject[PipelineRepository]

}