package controllers.assistant.api.visualizers

import controllers.api.JsonImplicits._
import model.assistant.entity.ApplicationId
import model.assistant.rest.Response._
import model.assistant.rest.timeline.ThingsConnectionRequest.ThingsConnectionsRequest
import model.assistant.rest.timeline.UrlsStartEndRequest.UrlsStartEndRequest
import model.rdf.sparql.timeline._
import play.api.libs.concurrent.Execution.Implicits._
import scaldi.Injector

import scala.concurrent.Future

class TimeLineVisualizerApiController(implicit val inj: Injector) extends VisualizerApiController {
  val timelineService = inject[TimeLineService]
  val timelineCountService = inject[TimeLineCountService]

  def getIntervals(id: Long) = RestAsyncAction[UrlsStartEndRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val intervals = timelineService.intervals(evaluation, json.start, json.end, json.urls, json.limit)
        Future(Ok(SuccessResponse(data = Seq("intervals" -> intervals))))
      }
  }

  def getIntervalsCount(id: Long) = RestAsyncAction[UrlsStartEndRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val count = timelineCountService.intervals(evaluation, json.start, json.end, json.urls, json.limit)
        Future(Ok(SuccessResponse(data = Seq("count" -> count))))
      }
  }

  def getInstants(id: Long) = RestAsyncAction[UrlsStartEndRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val instants = timelineService.instants(evaluation, json.start, json.end, json.urls, json.limit)
        Future(Ok(SuccessResponse(data = Seq("instants" -> instants))))
      }
  }

  def getInstantsCount(id: Long) = RestAsyncAction[UrlsStartEndRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val count = timelineCountService.instants(evaluation, json.start, json.end, json.urls, json.limit)
        Future(Ok(SuccessResponse(data = Seq("count" -> count))))
      }
  }

  def getThingsWithIntervals(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val thingsWithIntervals = timelineService.thingsWithIntervals(evaluation, json.things, json.thingTypes, json.predicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("thingsWithIntervals" -> thingsWithIntervals))))
      }
  }

  def getThingsWithIntervalsCount(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val count = timelineCountService.thingsWithIntervals(evaluation, json.things, json.thingTypes, json.predicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("count" -> count))))
      }
  }

  def getThingsWithInstants(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val thingsWithInstants = timelineService.thingsWithInstants(evaluation, json.things, json.thingTypes, json.predicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("thingsWithInstants" -> thingsWithInstants))))
      }
  }

  def getThingsWithInstantsCount(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val count = timelineCountService.thingsWithInstants(evaluation, json.things, json.thingTypes, json.predicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("count" -> count))))
      }
  }

  def getThingsWithThingsWithIntervals(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val thingsWithThingsWithIntervals = timelineService.thingsWithThingsWithIntervals(evaluation, json.things, json.thingTypes, json.predicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("thingsWithThingsWithIntervals" -> thingsWithThingsWithIntervals))))
      }
  }

  def getThingsWithThingsWithIntervalsCount(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val count = timelineCountService.thingsWithThingsWithIntervals(evaluation, json.things, json.thingTypes, json.predicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("count" -> count))))
      }
  }

  def getThingsWithThingsWithInstants(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val thingsWithThingsWithInstants = timelineService.thingsWithThingsWithInstants(evaluation, json.things, json.thingTypes, json.predicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("thingsWithThingsWithInstants" -> thingsWithThingsWithInstants))))
      }
  }

  def getThingsWithThingsWithInstantsCount(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val count = timelineCountService.thingsWithThingsWithInstants(evaluation, json.things, json.thingTypes, json.predicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("count" -> count))))
      }
  }
}