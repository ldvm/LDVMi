package controllers.appgen.api.visualizers

import controllers.api.JsonImplicits._
import model.appgen.entity.ApplicationId
import model.appgen.rest.EmptyRequest.EmptyRequest
import model.appgen.rest.Response._
import model.rdf.sparql.rgml.RgmlService
import scaldi.Injector
import play.api.libs.concurrent.Execution.Implicits._

import scala.concurrent.Future

class ChordVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
  val rgmlService = inject[RgmlService]

  def getGraph(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val graph = rgmlService.graph(evaluation)
      Future(Ok(SuccessResponse(data = Seq("graph" -> graph))))
    }
  }

  def getEdges(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val edges = rgmlService.edges(evaluation)
      Future(Ok(SuccessResponse(data = Seq("edges" -> edges))))
    }
  }

  def getMatrix(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val matrix = rgmlService.matrix(evaluation)
      Future(Ok(SuccessResponse(data = Seq("matrix" -> matrix))))
    }
  }
}
