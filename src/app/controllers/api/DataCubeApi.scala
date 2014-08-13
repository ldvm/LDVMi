package controllers.api

import data.models._

import play.api.mvc._
import play.api.db.slick._
import play.api.Play.current

import play.api.libs.json._
import play.api.cache.Cache

import scaldi.{Injectable, Injector}
import services.data.rdf.sparql.datacube._


class DataCubeApi(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject[DataCubeService]

  def dataStructures(id: Long) = DBAction { implicit rs =>
    withVisualizationAndDataSource(id) { (v, d) =>
      Ok(Json.toJson(dataCubeService.getDataStructures(d)))
    }
  }

  def values(id: Long) = DBAction(parse.json) { implicit rs =>

    val json: JsValue = rs.request.body
    val uris = json \ "uris"

    withVisualizationAndDataSource(id) { (v, d) =>
      Ok(Json.toJson(dataCubeService.getValues(d, uris.as[List[String]])))
    }
  }

  def sliceCube(id: Long) = DBAction(parse.json(1024 * 1024 * 100)) { implicit rs =>
    val json: JsValue = rs.request.body

    _withVisualizationDataSourceAndCubeQuery(id, json) { case (v, d, q) =>
      val result = dataCubeService.sliceCubeAndPersist(v, d, q, json)
      val jsonResult = Json.toJson(result)
      Cache.set(jsonCacheKey(id, result.permalinkToken), jsonResult)
      Ok(jsonResult)
    }
  }

  private def _withVisualizationDataSourceAndCubeQuery(id: Long, json: JsValue)
      (func: (Visualization, DataSource, DataCubeQueryData) => Result)
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Result = {

    json.validate[DataCubeQueryData] match {
      case s: JsSuccess[DataCubeQueryData] => {

        val queryData: DataCubeQueryData = s.get
        withVisualizationAndDataSource(id) { (v, d) =>
          func(v, d, queryData)
        }

      }
      case e: JsError => {
        UnprocessableEntity
      }
    }

  }

  def datasets(id: Long) = DBAction { implicit rs =>
    withVisualizationAndDataSource(id) { (v, d) =>
      Ok(Json.toJson(dataCubeService.getDatasets(d)))
    }
  }

  private def withVisualizationAndDataSource(id: Long)
      (func: (Visualization, DataSource) => Result)
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Result = {

    Visualizations.findByIdWithDataSource(id).map { case (visualization, datasource) =>
      func(visualization, datasource)
    }.getOrElse {
      NotFound
    }
  }

}