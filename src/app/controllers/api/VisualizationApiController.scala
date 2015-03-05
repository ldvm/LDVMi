package controllers.api

import play.api.Play.current
import play.api.db.slick._
import play.api.cache.Cache
import play.api.db.slick.DBAction
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}
import JsonImplicits._

class VisualizationApiController(implicit inj: Injector) extends ApiController with Injectable {

  def getCachedResult(id: Long, permalinkToken: String) = Action { r =>
    val mayBeResult = Cache.getAs[JsValue](jsonCacheKey(id, permalinkToken))
    Ok(mayBeResult.getOrElse(JsObject(Seq(("error", JsString("notfound"))))))
  }

  def tree(id: Long) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      Ok(Json.toJson(visualizationService.hierarchy(evaluation)))
    }
  }

}