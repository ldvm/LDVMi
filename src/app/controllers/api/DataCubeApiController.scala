package controllers.api

//import model.dao.VisualizationEagerBox
import model.rdf.sparql.datacube._
import play.api.Play.current
import play.api.cache.Cache
import play.api.db.slick._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json._
import play.api.mvc._
import scaldi.Injector

import scala.concurrent.Future


class DataCubeApiController(implicit inj: Injector) extends ApiController {
/*
  def dataStructures(id: Long) = DBAction { implicit rs =>
    withVisualizationEagerBox(id) { visualizationEagerBox =>
      Ok(Json.toJson(dataCubeService.getDataStructures(visualizationEagerBox.datasource)))
    }
  }

  def dataStructureComponents(id: Long, uri: String) = DBAction { implicit rs =>
    withVisualizationEagerBox(id) { visualizationEagerBox =>
      val components = dataCubeService.getDataStructureComponents(visualizationEagerBox.datasource, uri)
      val componentsJson = Seq("components" -> components).toMap
      Ok(Json.toJson(componentsJson))
    }
  }

  def values(id: Long) = parsingFuture(id) { (visualizationEagerBox, uris: List[String], _) =>
    val futures = dataCubeService.getValues(visualizationEagerBox.datasource, uris).map(m =>
      enumeratorToSeq(m._2).transform(values => m._1 -> values, t => t)
    )

    Future.sequence(futures).transform(s => Ok(Json.toJson(s.toMap)), t => t)
  }{ json => (json \ "uris").validate[List[String]] }

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
      Ok(Json.toJson(dataCubeService.getDatasets(visualizationEagerBox.datasource)))
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

  }*/

}