package controllers.api

import play.api.libs.json.Json
import scaldi.Injector


class MapApiController(implicit inj: Injector) extends ApiController {

  def polygonEntities(id: Long) = simpleFuture(id){ visualizationEagerBox =>
    geoService.polygonEntities(visualizationEagerBox.dataSource)
  }{ entities => Json.toJson(entities) }

  def polygonEntitiesProperties(id: Long) = simpleFuture(id){ visualizationEagerBox =>
    geoService.polygonEntitiesProperties(visualizationEagerBox.dataSource)
  }{ entities => Json.toJson(entities) }
}