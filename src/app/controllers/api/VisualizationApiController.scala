package controllers.api

import controllers.api.JsonImplicits._
import model.entity.PipelineEvaluationId
import play.api.Play.current
import play.api.cache.Cache
import play.api.db.slick.{DBAction, _}
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}

class VisualizationApiController(implicit inj: Injector) extends ApiController with Injectable {

  def getCachedResult(id: Long, permalinkToken: String) = Action { r =>
    val mayBeResult = Cache.getAs[JsValue](jsonCacheKey(id, permalinkToken))
    Ok(mayBeResult.getOrElse(JsObject(Seq(("error", JsString("notfound"))))))
  }

  def dataReferences(id: Long) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      Ok(Json.toJson(visualizationService.dataReferences(evaluation)))
    }
  }

  def queries(id: Long, permalinkToken: String) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      val query = pipelineService.findQueryByIdAndToken(evaluation.id.get, permalinkToken)
      query.map(q => Ok(q.storedData)).getOrElse(NotFound)
    }
  }

  def customCube(id: Long, permalinkToken: String, dimensionUri: String, valueUri: String) = DBAction { implicit rs =>

    pipelineService.modifyEvaluationQuery(PipelineEvaluationId(id), permalinkToken, dimensionUri, valueUri)
      .map { token =>
      val filteredParams = rs.request
        .queryString.-("token", "dimensionUri", "valueUri")
        .flatMap { case (k, values) =>
        values.map { v => k + "=" + v }
      }.mkString("&")

      Redirect("/visualize/datacube#/id/" + id + "/?p=" + token + "&" + filteredParams)
    }.getOrElse {
      NotFound
    }
  }

}