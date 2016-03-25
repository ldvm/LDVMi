package controllers.appgen.api

import controllers.appgen.api.rest.RestController
import model.appgen.service.VisualizerService
import model.appgen.rest.EmptyRequest._
import scaldi.Injector
import model.appgen.rest.Response._

class CommonApiController(implicit inj: Injector) extends RestController {
  val visualizerService = inject[VisualizerService]

  def getVisualizers = RestAction[EmptyRequest] { implicit request => json =>
    Ok(SuccessResponse(data = Seq(
      "visualizers" -> visualizerService.getVisualizers
    )))
  }
}
