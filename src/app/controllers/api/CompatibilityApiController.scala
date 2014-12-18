package controllers.api

import model.entity.PipelineId
import model.service.{PipelineService, CompatibilityService}
import play.api.db.slick.DBAction
import play.api.mvc.Controller
import scaldi.{Injectable, Injector}

class CompatibilityApiController(implicit inj: Injector) extends Controller with Injectable {

  val compatibilityService = inject[CompatibilityService]
  val pipelineService = inject[PipelineService]

  def check(pipelineId: Long) = DBAction { rws =>

    pipelineService.findById(PipelineId(pipelineId))(rws.dbSession).map { pipeline =>
      compatibilityService.check(pipeline.bindingSet(rws.dbSession))(rws.dbSession)

    }

    Ok("done")
  }
}
