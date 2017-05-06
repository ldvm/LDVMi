package controllers.assistant.api.visualizers

import controllers.api.JsonImplicits._
import play.api.libs.concurrent.Execution.Implicits._
import model.assistant.entity.ApplicationId
import model.assistant.rest.Response._
import model.assistant.rest.ThingsConnectionRequest.ThingsConnectionsRequest
import model.assistant.rest.UrlsStartEndRequest.UrlsStartEndRequest
import model.rdf.sparql.rgml.{RgmlCountService, RgmlService}
import scaldi.Injector
import scala.concurrent.Future

class TimeLineVisualizerApiController(implicit val inj: Injector) extends VisualizerApiController {
  val rgmlService = inject[RgmlService]
  val rgmlCountService = inject[RgmlCountService]

  def getIntervals(id: Long) = RestAsyncAction[UrlsStartEndRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val intervals = rgmlService.intervals(evaluation, json.begin, json.end, json.urls, json.limit)
      Future(Ok(SuccessResponse(data = Seq("intervals" -> intervals))))
    }
  }

  def getIntervalsCount(id: Long) = RestAsyncAction[UrlsStartEndRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val count = rgmlCountService.intervals(evaluation, json.begin, json.end, json.urls, json.limit)
      Future(Ok(SuccessResponse(data = Seq("count" -> count))))
    }
  }

  def getInstants(id: Long) = RestAsyncAction[UrlsStartEndRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val instants = rgmlService.instants(evaluation, json.begin, json.end, json.urls, json.limit)
      Future(Ok(SuccessResponse(data = Seq("instants" -> instants))))
    }
  }

  def getInstantsCount(id: Long) = RestAsyncAction[UrlsStartEndRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val count = rgmlCountService.instants(evaluation, json.begin, json.end, json.urls, json.limit)
      Future(Ok(SuccessResponse(data = Seq("count" -> count))))
    }
  }

  def getThingWithIntervals(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val thingsWithIntervals = rgmlService.thingsWithIntervals(evaluation, json.things, json.connections, json.limit)
      Future(Ok(SuccessResponse(data = Seq("thingsWithIntervals" -> thingsWithIntervals))))
    }
  }

  def getThingsWithIntervalsCount(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val count = rgmlCountService.thingsWithIntervals(evaluation, json.things, json.connections, json.limit)
      Future(Ok(SuccessResponse(data = Seq("count" -> count))))
    }
  }

  def getThingsWithInstants(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val thingsWithInstants = rgmlService.thingsWithInstants(evaluation, json.things, json.connections, json.limit)
      Future(Ok(SuccessResponse(data = Seq("thingsWithInstants" -> thingsWithInstants))))
    }
  }

  def getThingsWithInstantsCount(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val count = rgmlCountService.thingsWithInstants(evaluation, json.things, json.connections, json.limit)
      Future(Ok(SuccessResponse(data = Seq("count" -> count))))
    }
  }

  def getThingsWithThingsWithIntervals(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val thingsWithThingsWithIntervals = rgmlService.thingsWithThingsWithIntervals(evaluation, json.things, json.connections, json.limit)
      Future(Ok(SuccessResponse(data = Seq("thingsWithThingsWithIntervals" -> thingsWithThingsWithIntervals))))
    }
  }

  def getThingsWithThingsWithIntervalsCount(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val count = rgmlCountService.thingsWithThingsWithIntervals(evaluation, json.things, json.connections, json.limit)
      Future(Ok(SuccessResponse(data = Seq("count" -> count))))
    }
  }

  def getThingsWithThingsWithInstants(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request =>json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val thingsWithThingsWithInstants = rgmlService.thingsWithThingsWithInstants(evaluation, json.things, json.connections, json.limit)
      Future(Ok(SuccessResponse(data = Seq("thingsWithThingsWithInstants" -> thingsWithThingsWithInstants))))
    }
  }

  def getThingsWithThingsWithInstantsCount(id: Long) = RestAsyncAction[ThingsConnectionsRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val count = rgmlCountService.thingsWithThingsWithInstants(evaluation, json.things, json.connections, json.limit)
      Future(Ok(SuccessResponse(data = Seq("count" -> count))))
    }
  }
}