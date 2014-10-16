package controllers.api

import model.services.rdf.sparql.geo.PolygonQueryData
import play.api.libs.json.Json
import scaldi.Injector


class MapApiController(implicit inj: Injector) extends ApiController {

  def polygonEntities(id: Long) = simpleParsingFuture(id) { (visualizationEagerBox, queryData: PolygonQueryData, json) =>
    geoService.polygonEntities(visualizationEagerBox.dataSource, queryData)
  } { json => json.validate[PolygonQueryData] } { entities => Json.toJson(entities) }

  def polygonEntitiesProperties(id: Long) = simpleFuture(id) { visualizationEagerBox =>
    geoService.polygonEntitiesProperties(visualizationEagerBox.dataSource)
  } { entities => Json.toJson(entities) }
}