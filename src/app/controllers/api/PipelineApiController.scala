package controllers.api

import model.service.PipelineService
import play.api.mvc.Controller
import scaldi.{Injectable, Injector}

class PipelineApiController(implicit inj: Injector) extends Controller with Injectable {
  val pipelineService = inject[PipelineService]
}