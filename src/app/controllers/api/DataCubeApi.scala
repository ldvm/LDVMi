package controllers.api

import data.models._
import play.api.Play.current
import play.api.cache.Cache
import play.api.db.slick._
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}
import services.data.rdf.sparql.datacube._

import scala.concurrent.Future


class DataCubeApi(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject[DataCubeService]

  def dataStructures(id: Long) = Action.async { request =>
    DB.withSession { implicit s =>
      withVisualizationAndDataSources(id) { (v, d, d2) =>
        Ok(Json.toJson(dataCubeService.getDataStructures(d2)))
      }
    }
  }

  def values(id: Long) = Action.async(parse.json) { request =>

    val json: JsValue = request.body
    val uris = json \ "uris"

    DB.withSession { implicit s =>
      withVisualizationAndDataSources(id) { (v, d, d2) =>
        Ok(Json.toJson(dataCubeService.getValues(d, uris.as[List[String]])))
      }
    }
  }

  def sliceCube(id: Long) = Action.async(parse.json(1024 * 1024 * 100)) { implicit request =>
    val json: JsValue = request.body

    DB.withSession { implicit s =>
      _withVisualizationDataSourceAndCubeQuery(id, json) { case (v, d, q) =>
        val result = dataCubeService.sliceCubeAndPersist(v, d, q, json)
        val jsonResult = Json.toJson(result)
        Cache.set(jsonCacheKey(id, result.permalinkToken), jsonResult)
        Ok(jsonResult)
      }
    }
  }

  private def _withVisualizationDataSourceAndCubeQuery(id: Long, json: JsValue)
      (func: (Visualization, DataSource, DataCubeQueryData) => Result)
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Future[Result] = {

    json.validate[DataCubeQueryData] match {
      case s: JsSuccess[DataCubeQueryData] => {

        val queryData: DataCubeQueryData = s.get
        withVisualizationAndDataSources(id) { (v, d, d2) =>
          func(v, d, queryData)
        }

      }
      case e: JsError => {
        Future { UnprocessableEntity }
      }
    }

  }

  private def withVisualizationAndDataSources(id: Long)
      (func: (Visualization, DataSource, DataSource) => Result)
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Future[Result] = {

    Visualizations.findByIdWithDataSource(id).map { case (visualization, datasource, dsdDataSource) =>
      Future { func(visualization, datasource, dsdDataSource) }
    }.getOrElse {
      Future { NotFound }
    }
  }

  def datasets(id: Long) = Action.async { request =>
    DB.withSession { implicit session =>
      withVisualizationAndDataSources(id) { (v, d, d2) =>
        Ok(Json.toJson(dataCubeService.getDatasets(d)))
      }
    }
  }

}