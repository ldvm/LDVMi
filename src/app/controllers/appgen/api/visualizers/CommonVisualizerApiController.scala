package controllers.appgen.api.visualizers

import controllers.api.JsonImplicits._
import model.rdf.sparql.visualization.VisualizationService
import model.appgen.entity.ApplicationId
import model.appgen.rest.GetLabelsRequest.GetLabelsRequest
import model.appgen.rest.Response._
import scaldi.Injector
import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.Future

class CommonVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
  val visualizationService = inject[VisualizationService]

  def getLabels(id: Long) = RestAsyncAction[GetLabelsRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val labels = json.resourceUris.map(uri => {
        // First try to get the label from pipeline output and if that fails
        // try standard dereferencing.
        val label = visualizationService
          .getLabels(evaluation, uri)
          .orElse(visualizationService.getLabels(uri))
        (uri, label)
      }).toMap
      Future(Ok(SuccessResponse(data = Seq("labels" -> labels))))
    }
  }
}
