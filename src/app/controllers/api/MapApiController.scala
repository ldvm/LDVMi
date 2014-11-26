package controllers.api

import model.rdf.sparql.geo.WKTQueryData
import play.api.libs.json.Json
import scaldi.Injector


class MapApiController(implicit inj: Injector) extends ApiController {
/*
  def polygonEntities(id: Long) = simpleParsingFuture(id) { (visualizationEagerBox, queryData: WKTQueryData, json) =>
    geoService.polygonEntities(visualizationEagerBox.datasource, queryData)
  } { json => json.validate[WKTQueryData] } { entities => Json.toJson(entities) }

  def polygonEntitiesProperties(id: Long) = simpleFuture(id) { visualizationEagerBox =>
    geoService.polygonEntitiesProperties(visualizationEagerBox.datasource)
  } { entities => Json.toJson(entities) }
  */
}