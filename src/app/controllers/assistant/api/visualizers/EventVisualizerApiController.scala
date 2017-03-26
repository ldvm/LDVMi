package controllers.assistant.api.visualizers

import scala.concurrent.Future
import model.assistant.entity.ApplicationId
import model.assistant.rest.Response._
import model.rdf.sparql.rgml.RgmlService
import controllers.api.JsonImplicits._
import model.assistant.rest.EventRequest.EventRequest
import model.assistant.rest.EventPeopleRequest.EventPeopleRequest
import play.api.libs.concurrent.Execution.Implicits._
import scaldi.Injector

class EventVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
  val rgmlService = inject[RgmlService]

  def getEvents(id: Long) = RestAsyncAction[EventRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val events = rgmlService.events(evaluation, json.start, json.end, json.limit)
      Future(Ok(SuccessResponse(data = Seq("events" -> events))))
    }
  }
  def getEventPeople(id: Long) = RestAsyncAction[EventPeopleRequest] { implicit request => json =>
    cached {
      withEvaluation(ApplicationId(id)) { evaluation =>
        var people = rgmlService.eventPeople(evaluation, json.event)
        Future(Ok(SuccessResponse(data = Seq("people" -> people))))
      }
    }
  }
}