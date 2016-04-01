package controllers.appgen.api.visualizers

import controllers.api.JsonImplicits._
import model.appgen.entity.ApplicationId
import model.appgen.rest.EmptyRequest.EmptyRequest
import model.appgen.rest.Response._
import model.rdf.sparql.chord.ChordService
import scaldi.Injector
import play.api.libs.concurrent.Execution.Implicits._

import scala.concurrent.Future

class ChordVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
  val chordService = inject[ChordService]


  def getEdges(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val edges = chordService.edges(evaluation)
      Future(Ok(SuccessResponse(data = Seq("edges" -> edges))))
    }
  }

  def getMatrix(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val matrix = chordService.matrix(evaluation)
      Future(Ok(SuccessResponse(data = Seq("matrix" -> matrix))))
    }
  }
}
