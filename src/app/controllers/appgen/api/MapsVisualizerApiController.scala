package controllers.appgen.api

import controllers.api.JsonImplicits._
import model.appgen.entity.ApplicationId
import model.appgen.rest.EmptyRequest.EmptyRequest
import model.rdf.sparql.geo.GeoService
import play.api.libs.concurrent.Execution.Implicits._
import scaldi.Injector
import model.appgen.rest.Response._
import scala.concurrent.Future

class MapsVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {

  val geoService = inject[GeoService]

  def getProperties(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      geoService.properties(evaluation).map {
        enumerator => enumeratorToResult("properties", enumerator)
      }.getOrElse {
        Future(NotFound(ErrorResponse("Unable to fetch map properties.")))
      }
    }
  }
}
