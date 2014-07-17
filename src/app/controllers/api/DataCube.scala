package controllers.api

import data.models._

import play.api._
import play.api.libs.json.{JsPath, Writes, Json}
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.db.slick._
import play.api.Play.current
import play.api.libs.json._
import play.api.libs.functional.syntax._

import scaldi.{Injectable, Injector}
import services.data.rdf.{Node, LocalizedValue}
import services.data.rdf.sparql.datacube._


class DataCube(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject[DataCubeService]

  implicit val localizedLiteralWrites = Json.writes[LocalizedValue]
  implicit val dataCubeDatasetWrites = Json.writes[DataCubeDataset]
  implicit val dataCubeDimensionPropertyWrites = Json.writes[DataCubeDimensionProperty]
  implicit val dataCubeMeasurePropertyWrites = Json.writes[DataCubeMeasureProperty]
  implicit val dataCubeAttributePropertyWrites = Json.writes[DataCubeAttributeProperty]
  implicit val dataCubeComponentWrites = Json.writes[DataCubeComponent]
  implicit val dataCubeDataStructureWrites = Json.writes[DataCubeDataStructure]

  def datasets(id: Long) = DBAction { implicit rs =>
    _withVisualizationAndDataSource(id){ (v, d) =>
      Ok(Json.toJson(dataCubeService.getDatasets(d)))
    }
  }

  def dataStructures(id: Long) = DBAction { implicit rs =>
    _withVisualizationAndDataSource(id){ (v, d) =>
      Ok(Json.toJson(dataCubeService.getDataStructures(d)))
    }
  }

  def values(id: Long) = DBAction(parse.json) { implicit rs =>

    val json : JsValue = rs.request.body
    val uris = json \ "uris"

    _withVisualizationAndDataSource(id){ (v, d) =>
      Ok(Json.toJson(dataCubeService.getValues(d, uris.as[List[String]])))
    }
  }

  private def _withVisualizationAndDataSource(id: Long)(func: (Visualization, DataSource) => Result)(implicit rs: play.api.db.slick.Config.driver.simple.Session): Result = {

    Visualizations.findByIdWithDataSource(id).map { case (visualization, datasource) =>
      func(visualization, datasource)
    }.getOrElse {
      NotFound
    }
  }

}