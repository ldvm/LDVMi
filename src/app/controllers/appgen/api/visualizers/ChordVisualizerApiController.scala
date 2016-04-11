package controllers.appgen.api.visualizers

import controllers.api.JsonImplicits._
import model.appgen.entity.ApplicationId
import model.appgen.rest.EmptyRequest.EmptyRequest
import model.appgen.rest.NodeUrisRequest.NodeUrisRequest
import model.appgen.rest.Response._
import model.rdf.sparql.fresnel.FresnelService
import model.rdf.sparql.rgml.RgmlService
import scaldi.Injector
import play.api.libs.concurrent.Execution.Implicits._

import scala.concurrent.Future

class ChordVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
  val rgmlService = inject[RgmlService]
  val fresnelService = inject[FresnelService]

  def getGraph(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val graph = rgmlService.graph(evaluation)
      Future(Ok(SuccessResponse(data = Seq("graph" -> graph))))
    }
  }

  def getSampleNodes(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      // TODO: take 20 with the highest degree
      val nodes = rgmlService.nodes(evaluation).getOrElse(Seq.empty).take(20)
      Future(Ok(SuccessResponse(data = Seq("nodes" -> nodes))))
    }
  }

  def getEdges(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val edges = rgmlService.edges(evaluation)
      Future(Ok(SuccessResponse(data = Seq("edges" -> edges))))
    }
  }

  def getMatrix(id: Long) = RestAsyncAction[NodeUrisRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val matrix = rgmlService.matrix(evaluation, json.nodeUris)
      Future(Ok(SuccessResponse(data = Seq("matrix" -> matrix))))
    }
  }

  def getSearchableLens(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      // TODO: change back to "searchable"
      val lens = fresnelService.lensesByPurpose(evaluation, "searchabl").getOrElse(Seq.empty).headOption
      Future(Ok(SuccessResponse(data = Seq("lens" -> lens))))
    }
  }
}
