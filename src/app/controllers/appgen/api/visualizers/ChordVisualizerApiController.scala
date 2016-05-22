package controllers.appgen.api.visualizers

import controllers.api.JsonImplicits._
import model.appgen.entity.ApplicationId
import model.appgen.rest.EmptyRequest.EmptyRequest
import model.appgen.rest.NodeUrisRequest.NodeUrisRequest
import model.appgen.rest.RelatedNodesRequest.RelatedNodesRequest
import model.appgen.rest.Response._
import model.appgen.rest.SearchRequest.SearchRequest
import model.entity.PipelineEvaluation
import model.rdf.sparql.fresnel.{FresnelService, Lens}
import model.rdf.sparql.rgml.RgmlService
import play.api.db.slick.Session
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

  def getNodes(id: Long) = RestAsyncAction[NodeUrisRequest] { implicit  request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val nodes = rgmlService.nodes(evaluation, json.nodeUris)
      Future(Ok(SuccessResponse(data = Seq("nodes" -> nodes))))
    }
  }

  def getSampleNodes(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val nodes = rgmlService.sampleNodesWithForestFire(evaluation, 30)
      // val nodes = rgmlService.sampleNodesByHighestDegree(evaluation, 30)
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
      val lens = findSearchableLens(evaluation)
      Future(Ok(SuccessResponse(data = Seq("lens" -> lens))))
    }
  }

  def searchNodes(id: Long) = RestAsyncAction[SearchRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val result = findSearchableLens(evaluation) map { lens =>
        fresnelService.searchThroughLens(evaluation, lens, json.needle.trim)
      }
      Future(Ok(SuccessResponse(data = Seq("result" -> result))))
    }
  }

  def getRelatedNodes(id: Long) = RestAsyncAction[RelatedNodesRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val relatedNodes = rgmlService
        .adjacentNodes(evaluation, json.nodeUri, json.direction)
        .flatMap { nodes => Some(nodes.map(_.uri)) }
      Future(Ok(SuccessResponse(data = Seq("relatedNodes" -> relatedNodes))))
    }
  }

  private def findSearchableLens(evaluation: PipelineEvaluation)(implicit session: Session) = {
    fresnelService.lensesByPurpose(evaluation, "searchable").getOrElse(Seq.empty).headOption
  }
}
