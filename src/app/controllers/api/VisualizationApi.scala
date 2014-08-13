package controllers.api

import data.models.VisualizationQueries
import play.api.cache.Cache
import play.api.mvc._
import play.api.db.slick._
import play.api.Play.current
import play.api.libs.json._


import scaldi.{Injectable, Injector}

class VisualizationApi(implicit inj: Injector) extends Controller with Injectable {

  def queries(id: Long, permalinkToken: String) = DBAction { implicit rs =>
    val query = VisualizationQueries.findByIdAndToken(id, permalinkToken)
    query.map(q => Ok(q.storedData)).getOrElse(NotFound)

  }

  def getCachedResult(id: Long, permalinkToken: String) = Action { r =>
    val mayBeResult = Cache.getAs[JsValue](jsonCacheKey(id, permalinkToken))
    Ok(mayBeResult.getOrElse(JsObject(Seq(("error", JsString("notfound"))))))
  }

}
