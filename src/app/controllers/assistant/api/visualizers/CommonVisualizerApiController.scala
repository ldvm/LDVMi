package controllers.assistant.api.visualizers

import controllers.api.JsonImplicits._
import model.rdf.sparql.visualization.VisualizationService
import model.assistant.entity.ApplicationId
import model.assistant.rest.GetLabelsRequest.GetLabelsRequest
import model.assistant.rest.GetCommentsRequest.GetCommentsRequest
import model.assistant.rest.Response._
import scaldi.Injector
import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.Future

class CommonVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
  val visualizationService = inject[VisualizationService]

  def getLabels(id: Long) = RestAsyncAction[GetLabelsRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val labels = json.resourceUris.map(uri => {
        // First try to get the label from pipeline output and if that fails
        // try standard dereferencing. We're using this crazy construct to get 'None's for
        // empty localized values (they will translate in nulls on the client).
        val label = visualizationService
          .getLabels(evaluation, uri)
          .flatMap(l => if (l.size == 0) visualizationService.getLabels(uri) else Some(l))
          .flatMap(l => if (l.size == 0) None else Some(l))

        (uri, label)
      }).toMap
      Future(Ok(SuccessResponse(data = Seq("labels" -> labels))))
    }
  }

  def getComments(id: Long) = RestAsyncAction[GetCommentsRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val comments = json.resourceUris.map(uri => {
        val comment = visualizationService
          .getComments(evaluation, uri)
          .flatMap(l => if (l.size == 0) visualizationService.getComments(uri) else Some(l))
          .flatMap(l => if (l.size == 0) None else Some(l))

        (uri, comment)
      }).toMap
      Future(Ok(SuccessResponse(data = Seq("comments" -> comments))))
    }
  }
}
