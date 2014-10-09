package controllers.api

import play.api.Play.current
import play.api.db.slick._
import play.api.libs.json._
import scaldi.Injector


class MapApiController(implicit inj: Injector) extends ApiController {

  def polygonEntities(id: Long) = DBAction { implicit rs =>
    withVisualizationEagerBox(id) { visualizationEagerBox =>
      Ok(Json.toJson(geoService.polygonEntities(visualizationEagerBox.dataSource)))
    }
  }

}