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
      // Get 30 nodes with the highest out degree and lets hope there will be something to visualize
      val nodes = rgmlService.nodes(evaluation).getOrElse(Seq.empty)
        .sortBy(-_.outDegree).take(30)
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
      val lens = fresnelService.lensesByPurpose(evaluation, "searchable").getOrElse(Seq.empty).headOption
      Future(Ok(SuccessResponse(data = Seq("lens" -> lens))))
    }
  }
}
