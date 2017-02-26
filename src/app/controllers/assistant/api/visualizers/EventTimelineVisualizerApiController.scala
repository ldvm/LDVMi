package controllers.assistant.api.visualizers

import scala.concurrent.Future
import model.assistant.entity.ApplicationId
import model.assistant.rest.EmptyRequest.EmptyRequest
import model.assistant.rest.Response._
import model.rdf.sparql.rgml.RgmlService
import controllers.api.JsonImplicits._
import play.api.libs.concurrent.Execution.Implicits._
import scaldi.Injector

class EventTimelineVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
  val rgmlService = inject[RgmlService]

  def getEvents(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val events = rgmlService.events(evaluation)
      Future(Ok(SuccessResponse(data = Seq("events" -> events))))
    }
  }
}