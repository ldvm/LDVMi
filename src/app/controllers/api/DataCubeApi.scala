package controllers.api

import data.models._
import play.api.Play.current
import play.api.cache.Cache
import play.api.db.slick._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.iteratee.{Iteratee, Enumeratee}
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}
import services.data.rdf.sparql.datacube._

import scala.concurrent.Future


class DataCubeApi(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject[DataCubeService]

  def dataStructures(id: Long) = DBAction { implicit rs =>
    withVisualizationAndDataSources(id) { (v, d, d2) =>
      Ok(Json.toJson(dataCubeService.getDataStructures(d2)))
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

  def values(id: Long) = Action.async(parse.json) { implicit request =>

    val json: JsValue = request.body
    val uris = json \ "uris"

    DB.withSession { s =>
      withVisualizationAndDataSourcesFuture(id) { (v, d, d2) =>
        val futures = dataCubeService.getValues(d, uris.as[List[String]]).map(m =>
          (m._2 through Enumeratee.filter(_.isDefined))
            .run(
              Iteratee.fold(List.empty[DataCubeComponentValue])((list, item) => list :+ item.get)
            ).transform(values => m._1 -> values, t => t)
        )

        Future.sequence(futures).transform(s => Ok(Json.toJson(s.toMap)), t => t)
      }(s)
    }
  }

  private def withVisualizationAndDataSourcesFuture(id: Long)
      (func: (Visualization, DataSource, DataSource) => Future[Result])
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Future[Result] = {

    Visualizations.findByIdWithDataSource(id).map { case (visualization, datasource, dsdDataSource) =>
      func(visualization, datasource, dsdDataSource)
    }.getOrElse {
      Future { NotFound }
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

  def datasets(id: Long) = DBAction { implicit rs =>
    withVisualizationAndDataSources(id) { (v, d, d2) =>
      Ok(Json.toJson(dataCubeService.getDatasets(d)))
    }
  }

}