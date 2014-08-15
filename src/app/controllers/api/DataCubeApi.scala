package controllers.api

import data.models._
import play.api.Play.current
import play.api.cache.Cache
import play.api.db.slick._
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}
import services.data.rdf.sparql.datacube._


class DataCubeApi(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject[DataCubeService]

  def dataStructures(id: Long) = DBAction { implicit rs =>
    withVisualizationAndDataSources(id) { (v, d, d2) =>
      Ok(Json.toJson(dataCubeService.getDataStructures(d2)))
    }
  }

  def values(id: Long) = DBAction(parse.json) { implicit rs =>

    val json: JsValue = rs.request.body
    val uris = json \ "uris"

    withVisualizationAndDataSources(id) { (v, d, d2) =>
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
        withVisualizationAndDataSources(id) { (v, d, d2) =>
          func(v, d, queryData)
        }

      }
      case e: JsError => {
        UnprocessableEntity
      }
    }

  }

  private def withVisualizationAndDataSources(id: Long)
      (func: (Visualization, DataSource, DataSource) => Result)
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Result = {

    Visualizations.findByIdWithDataSource(id).map { case (visualization, datasource, dsdDataSource) =>
      func(visualization, datasource, dsdDataSource)
    }.getOrElse {
      NotFound
    }
  }

  def datasets(id: Long) = DBAction { implicit rs =>
    withVisualizationAndDataSources(id) { (v, d, d2) =>
      Ok(Json.toJson(dataCubeService.getDatasets(d)))
    }
  }

}