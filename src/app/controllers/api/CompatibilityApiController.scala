package controllers.api

import model.entity.PipelineId
import model.service.{CompatibilityService, PipelineService}
import play.api.Play.current
import play.api.db
import play.api.libs.json.JsValue
import play.api.mvc.{Controller, WebSocket}
import scaldi.{Injectable, Injector}

class CompatibilityApiController(implicit inj: Injector) extends Controller with Injectable {

  val compatibilityService = inject[CompatibilityService]
  val pipelineService = inject[PipelineService]

  def check(pipelineId: Long) = withWebSocket { logger => implicit session =>
    val maybePipeline = pipelineService.findById(PipelineId(pipelineId))
    maybePipeline.map { pipeline =>
      compatibilityService.check(pipeline.bindingSet, logger)
    }
  }
}
