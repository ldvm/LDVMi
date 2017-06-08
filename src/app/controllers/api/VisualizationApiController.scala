package controllers.api

import controllers.api.JsonImplicits._
import play.api.Play.current
import play.api.cache.Cache
import play.api.db.slick.{DBAction, _}
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}

class VisualizationApiController(implicit inj: Injector) extends ApiController with Injectable {

  def dereferenceLabels(uri: String) = Action {
    val labels = visualizationService.getLabels(uri)
    Ok(Json.toJson(labels))
  }

  def dereferenceComments(uri: String) = Action {
    val comments = visualizationService.getComments(uri)
    Ok(Json.toJson(comments))
  }

  def getCachedResult(id: Long, permalinkToken: String) = Action { r =>
    val mayBeResult = Cache.getAs[JsValue](jsonCacheKey(id, permalinkToken))
    Ok(mayBeResult.getOrElse(JsObject(Seq(("error", JsString("notfound"))))))
  }

  def dataReferences(id: Long) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      Ok(Json.toJson(visualizationService.dataReferences(evaluation)))
    }
  }

  def findById(id: Long) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      Ok(Json.toJson(evaluation))
    }
  }

  def queries(id: Long, permalinkToken: String) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      val query = pipelineService.findQueryByIdAndToken(evaluation.id.get, permalinkToken)
      query.map(q => Ok(q.storedData)).getOrElse(NotFound)
    }
  }

}
