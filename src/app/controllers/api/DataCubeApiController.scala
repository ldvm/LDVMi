package controllers.api

import controllers.api.JsonImplicits._
import model.entity.PipelineEvaluation
import model.rdf.sparql.datacube.DataCubeQueryData
import play.api.Play.current
import play.api.db.slick._
import play.api.cache.Cache
import play.api.libs.json._
import play.api.mvc.Result
import scaldi.Injector

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future


class DataCubeApiController(implicit inj: Injector) extends ApiController {

  def dataStructures(id: Long) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      Ok(Json.toJson(dataCubeService.getDataStructures(evaluation)))
    }
  }


  def dataStructureComponents(id: Long, uri: String) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      val components = dataCubeService.getDataStructureComponents(evaluation, uri)
      val componentsJson = Seq("components" -> components).toMap
      Ok(Json.toJson(componentsJson))
    }
  }

  def values(id: Long) = DBAction(parse.json(1024 * 1024 * 100)) { implicit rs =>
    val json: JsValue = rs.request.body
    val urisValidation = (json \ "uris").validate[List[String]]

    urisValidation match {
      case v: JsSuccess[List[String]] => withEvaluation(id) { evaluation =>
        val values = dataCubeService.getValues(evaluation, v.get)
        Ok(Json.toJson(values))
      }
      case e: JsError => BadRequest
    }

  }

  def sliceCube(id: Long) = DBAction(parse.json(1024 * 1024 * 100)) { implicit rs =>
    val json: JsValue = rs.request.body

    withEvaluation(id, json) { case (evaluation, queryData) =>
      val result = dataCubeService.sliceCubeAndPersist(evaluation, queryData, json)
      val jsonResult = Json.toJson(result)
      Cache.set(jsonCacheKey(id, result.permalinkToken), jsonResult)
      Ok(jsonResult)
    }
  }

  private def withEvaluation(id: Long, json: JsValue)
    (func: (PipelineEvaluation, DataCubeQueryData) => Result)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): Result = {

    json.validate[DataCubeQueryData] match {
      case s: JsSuccess[DataCubeQueryData] =>

        withEvaluation(id) { evaluation =>
          func(evaluation, s.get)
        }

      case e: JsError => {
        InternalServerError(e.errors.toString)
      }
    }

  }

  def datasets(id: Long) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      Ok(Json.toJson(dataCubeService.getDatasets(evaluation)))
    }
  }
}

