package controllers.assistant.api.visualizers

import controllers.api.JsonImplicits._
import model.assistant.entity.ApplicationId
import model.assistant.rest.EmptyRequest.EmptyRequest
import model.assistant.rest.Response._
import model.assistant.rest.SkosConceptsCountsRequest.SkosConceptsCountsRequest
import model.assistant.rest.SkosConceptsRequest.SkosConceptsRequest
import model.rdf.sparql.geo.GeoService
import model.rdf.sparql.geo.models.MapQueryData
import model.rdf.sparql.visualization.VisualizationService
import play.api.libs.concurrent.Execution.Implicits._
import scaldi.Injector

import scala.concurrent.Future

class MapsVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
  val geoService = inject[GeoService]
  val visualizationService = inject[VisualizationService]

  def getProperties(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    cached {
      withEvaluation(ApplicationId(id)) { evaluation =>
        geoService.properties(evaluation).map {
          enumerator => enumeratorToResult("properties", enumerator)
        }.getOrElse {
          Future(NotFound(ErrorResponse("Unable to fetch map properties.")))
        }
      }
    }
  }

  def getSkosConcepts(id: Long) = RestAsyncAction[SkosConceptsRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val concepts = visualizationService.skosConcepts(evaluation, json.conceptUris)
      Future(Ok(SuccessResponse(data = Seq("skosConcepts" -> concepts))))
    }
  }

  def getSkosConceptsCounts(id: Long) = RestAsyncAction[SkosConceptsCountsRequest] { implicit request => json =>
    cached {
      withEvaluation(ApplicationId(id)) { evaluation =>
        val counts = visualizationService.skosConceptsCounts(evaluation, json.propertyUri, json.conceptUris)
        Future(Ok(SuccessResponse(data = Seq("skosConceptsCounts" -> counts))))
      }
    }
  }

  def getMarkers(id: Long) = RestAsyncAction[MapQueryData] { implicit request => queryData =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val markers = geoService.markers(evaluation, queryData)
      Future(Ok(SuccessResponse(data = Seq("markers" -> markers))))
    }
  }
}
