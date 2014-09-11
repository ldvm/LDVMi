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
import services.data.VisualizationService
import services.data.rdf.sparql.datacube._

import scala.concurrent.Future


class DataCubeApiController(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject[DataCubeService]
  val visualizationService = inject[VisualizationService]

  def dataStructures(id: Long) = DBAction { implicit rs =>
    withVisualizationEagerBox(id) { visualizationEagerBox =>
      Ok(Json.toJson(dataCubeService.getDataStructures(visualizationEagerBox.dsdDataSource)))
    }
  }

  def values(id: Long) = Action.async(parse.json) { implicit request =>

    val json: JsValue = request.body
    val uris = json \ "uris"

    DB.withSession { s =>
      withVisualizationAndDataSourcesFuture(id) { visualizationEagerBox =>
        val futures = dataCubeService.getValues(visualizationEagerBox.dsdDataSource, uris.as[List[String]]).map(m =>
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
      (func: VisualizationEagerBox => Future[Result])
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Future[Result] = {

    visualizationService.getByIdWithEager(id).map { visualizationEagerBox =>
      func(visualizationEagerBox)
    }.getOrElse {
      Future { NotFound }
    }
  }

  def sliceCube(id: Long) = DBAction(parse.json(1024 * 1024 * 100)) { implicit rs =>
    val json: JsValue = rs.request.body

    withVisualizationEagerBox(id, json) { case (visualizationEagerBox, queryData) =>
      val result = dataCubeService.sliceCubeAndPersist(visualizationEagerBox, queryData, json)
      val jsonResult = Json.toJson(result)
      Cache.set(jsonCacheKey(id, result.permalinkToken), jsonResult)
      Ok(jsonResult)
    }
  }

  def datasets(id: Long) = DBAction { implicit rs =>
    withVisualizationEagerBox(id) { visualizationEagerBox =>
      Ok(Json.toJson(dataCubeService.getDatasets(visualizationEagerBox.dataSource)))
    }
  }

  private def withVisualizationEagerBox(id: Long)
      (func: VisualizationEagerBox => Result)
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Result = {

    visualizationService.getByIdWithEager(id).map { visualizationEagerBox =>
      func(visualizationEagerBox)
    }.getOrElse {
      NotFound
    }
  }

  private def withVisualizationEagerBox(id: Long, json: JsValue)
      (func: (VisualizationEagerBox, DataCubeQueryData) => Result)
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Result = {

    json.validate[DataCubeQueryData] match {
      case s: JsSuccess[DataCubeQueryData] =>

        withVisualizationEagerBox(id) { visualizationEagerBox =>
          func(visualizationEagerBox, s.get)
        }

      case e: JsError => UnprocessableEntity
    }

  }

}