package controllers.api

import data.models._


import play.api._
import play.api.mvc._
import play.api.data.Forms._
import play.api.db.slick._
import play.api.Play.current
import play.api.libs.functional.syntax._

import play.api.libs.json._
import Json._

import scala.annotation.implicitNotFound
import scala.collection._
import scala.reflect.ClassTag

import scaldi.{Injectable, Injector}
import services.MD5
import services.data.rdf.{Node, LocalizedValue}
import services.data.rdf.sparql.datacube._


class DataCubeApi(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject[DataCubeService]

  def dataStructures(id: Long) = DBAction { implicit rs =>
    _withVisualizationAndDataSource(id) { (v, d) =>
      Ok(Json.toJson(dataCubeService.getDataStructures(d)))
    }
  }

  def values(id: Long) = DBAction(parse.json) { implicit rs =>

    val json: JsValue = rs.request.body
    val uris = json \ "uris"

    _withVisualizationAndDataSource(id) { (v, d) =>
      Ok(Json.toJson(dataCubeService.getValues(d, uris.as[List[String]])))
    }
  }

  def sliceCube(id: Long) = DBAction(parse.json(1024*1024*100)) { implicit rs =>
    val json: JsValue = rs.request.body
    _withVisualizationDataSourceAndCubeQuery(id, json) { case (v, d, q) =>
      Ok(Json.toJson(dataCubeService.sliceCubeAndPersist(v, d, q, json)))
    }
  }

  private def _withVisualizationDataSourceAndCubeQuery(id: Long, json: JsValue)
    (func: (Visualization, DataSource, DataCubeQueryData) => Result)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): Result = {

    json.validate[DataCubeQueryData] match {
      case s: JsSuccess[DataCubeQueryData] => {

        val queryData: DataCubeQueryData = s.get
        _withVisualizationAndDataSource(id) { (v, d) =>
          func(v, d, queryData)
        }

      }
      case e: JsError => {
        UnprocessableEntity
      }
    }

  }

  def datasets(id: Long) = DBAction { implicit rs =>
    _withVisualizationAndDataSource(id) { (v, d) =>
      Ok(Json.toJson(dataCubeService.getDatasets(d)))
    }
  }

  private def _withVisualizationAndDataSource(id: Long)
    (func: (Visualization, DataSource) => Result)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): Result = {

    Visualizations.findByIdWithDataSource(id).map { case (visualization, datasource) =>
      func(visualization, datasource)
    }.getOrElse {
      NotFound
    }
  }

}