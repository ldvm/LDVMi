package controllers.assistant.api.visualizers

import controllers.api.JsonImplicits._
import model.assistant.entity.ApplicationId
import model.assistant.rest.EmptyRequest.EmptyRequest
import model.assistant.rest.Response._
import model.assistant.rest.SkosConceptsCountsRequest.SkosConceptsCountsRequest
import model.assistant.rest.SkosConceptsRequest.SkosConceptsRequest
import model.assistant.rest.geo.CoordinatesRequest.CoordinatesRequest
import model.assistant.rest.geo.PlacesRequest.PlacesRequest
import model.assistant.rest.geo.QuantifiedPlacesRequest.QuantifiedPlacesRequest
import model.assistant.rest.geo.QuantifiedThingsRequest.QuantifiedThingsRequest
import model.rdf.sparql.geo.models.MapQueryData
import model.rdf.sparql.geo.{GeoCountService, GeoService}
import model.rdf.sparql.visualization.VisualizationService
import play.api.libs.concurrent.Execution.Implicits._
import scaldi.Injector

import scala.concurrent.Future

class MapsVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
  val geoService = inject[GeoService]
  val geoCountService = inject[GeoCountService]
  val visualizationService = inject[VisualizationService]

  def getProperties(id: Long) = RestAsyncAction[EmptyRequest] { implicit request =>
    json =>
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

  def getSkosConcepts(id: Long) = RestAsyncAction[SkosConceptsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val concepts = visualizationService.skosConcepts(evaluation, json.conceptUris)
        Future(Ok(SuccessResponse(data = Seq("skosConcepts" -> concepts))))
      }
  }

  def getSkosConceptsCounts(id: Long) = RestAsyncAction[SkosConceptsCountsRequest] { implicit request =>
    json =>
      cached {
        withEvaluation(ApplicationId(id)) { evaluation =>
          val counts = visualizationService.skosConceptsCounts(evaluation, json.propertyUri, json.conceptUris)
          Future(Ok(SuccessResponse(data = Seq("skosConceptsCounts" -> counts))))
        }
      }
  }

  def getMarkers(id: Long) = RestAsyncAction[MapQueryData] { implicit request =>
    queryData =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val markers = geoService.markers(evaluation, queryData)
        Future(Ok(SuccessResponse(data = Seq("markers" -> markers))))
      }
  }

  def getCoordinates(id: Long) = RestAsyncAction[CoordinatesRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val coord = geoService.coordinates(evaluation, json.urls, json.limit)
        Future(Ok(SuccessResponse(data = Seq("coordinates" -> coord))))
      }
  }

  def getPlaces(id: Long) = RestAsyncAction[PlacesRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val places = geoService.places(evaluation, json.urls, json.placeTypes, json.limit)
        Future(Ok(SuccessResponse(data = Seq("places" -> places))))
      }
  }

  def getQuantifiedThings(id: Long) = RestAsyncAction[QuantifiedThingsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val twp = geoService.quantifiedThings(evaluation, json.urls, json.valuePredicates, json.placePredicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("quantifiedThings" -> twp))))
      }
  }

  def getQuantifiedPlaces(id: Long) = RestAsyncAction[QuantifiedPlacesRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val quantifiers = geoService.quantifiedPlaces(evaluation, json.urls, json.placeTypes, json.valuePredicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("quantifiedPlaces" -> quantifiers))))
      }
  }

  def getCoordinatesCount(id: Long) = RestAsyncAction[CoordinatesRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val count = geoCountService.coordinates(evaluation, json.urls, json.limit)
        Future(Ok(SuccessResponse(data = Seq("count" -> count))))
      }
  }

  def getPlacesCount(id: Long) = RestAsyncAction[PlacesRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val count = geoCountService.places(evaluation, json.urls, json.placeTypes, json.limit)
        Future(Ok(SuccessResponse(data = Seq("count" -> count))))
      }
  }

  def getQuantifiedThingsCount(id: Long) = RestAsyncAction[QuantifiedThingsRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val count = geoCountService.quantifiedThings(evaluation, json.urls, json.valuePredicates, json.placePredicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("count" -> count))))
      }
  }

  def getQuantifiedPlacesCount(id: Long) = RestAsyncAction[QuantifiedPlacesRequest] { implicit request =>
    json =>
      withEvaluation(ApplicationId(id)) { evaluation =>
        val count = geoCountService.quantifiedPlaces(evaluation, json.urls, json.placeTypes, json.valuePredicates, json.limit)
        Future(Ok(SuccessResponse(data = Seq("count" -> count))))
      }
  }
}
