package controllers

import model.dao._
import model.services.IdentityEagerBox
import model.services.rdf.sparql.ValueFilter
import model.services.rdf.sparql.datacube._
import model.services.rdf.sparql.geo._
import model.services.rdf.{LocalizedValue, Property}
import play.api.libs.functional.syntax._
import play.api.libs.json._

package object api {

  implicit val localizedLiteralWrites = Json.writes[LocalizedValue]
  implicit val dataCubeDatasetWrites = Json.writes[DataCubeDataset]
  implicit val dataCubeDimensionPropertyWrites = Json.writes[DataCubeDimensionProperty]
  implicit val dataCubeMeasurePropertyWrites = Json.writes[DataCubeMeasureProperty]
  implicit val dataCubeAttributePropertyWrites = Json.writes[DataCubeAttributeProperty]
  implicit val dataCubeComponentWrites = Json.writes[DataCubeComponent]
  implicit val dataCubeDataStructureWrites = Json.writes[DataCubeDataStructure]
  implicit val dataCubeComponentValueWrites = Json.writes[DataCubeComponentValue]
  implicit val dataCubeKeyWrites = Json.writes[DataCubeKey]
  implicit val dataCubeCellWrites = Json.writes[DataCubeCell]
  implicit val dataCubeWrites = Json.writes[model.services.rdf.sparql.datacube.DataCube]
  implicit val dataCubeQueryResultWrites = Json.writes[DataCubeQueryResult]

  implicit val visualizationWrites = Json.writes[Visualization]
  implicit val dataSourceWrites = Json.writes[DataSource]

  implicit val coordinatesWrites = Json.writes[Coordinate]
  implicit val polygonWrites = Json.writes[Polygon]
  implicit val polygonEntitiesWrites = Json.writes[WKTEntity]
  implicit val propertyWrites = Json.writes[Property]

  implicit val visualizerWrites = Json.writes[Visualizer]
  implicit val visualizerCompatibilityWrites = Json.writes[VisualizerCompatibility]

  implicit val identityEagerBoxVisualizerWrites : Writes[IdentityEagerBox[Visualizer]] = Writes { eb =>
    Json.toJson(eb.mainEntity)
  }

  implicit val visualizationEagerBoxWrites: Writes[VisualizationEagerBox] = Writes {
    visualizationEagerBox =>
      JsObject(
        Seq(
          ("visualization", Json.toJson(visualizationEagerBox.visualization)),
          ("datasource", Json.toJson(visualizationEagerBox.dataSource)),
          ("dsdDatasource", Json.toJson(visualizationEagerBox.dsdDataSource)),
          ("token", Json.toJson(visualizationEagerBox.token))
        )
      )
  }

  implicit val visualizerCompatibilityEagerBoxWrites: Writes[VisualizerCompatibilityEagerBox] = Writes {
    visualizationEagerBox =>
      JsObject(
        Seq(
          ("visualizerCompatibility", Json.toJson(visualizationEagerBox.visualizerCompatibility)),
          ("visualizer", Json.toJson(visualizationEagerBox.visualizer))
        )
      )
  }


  val filterPath = (JsPath \ "label").readNullable[String] and
    (JsPath \ "dataType").readNullable[String] and
    (JsPath \ "uri").readNullable[String] and
    (JsPath \ "isActive").readNullable[Boolean]

  implicit val valueFilterReads: Reads[ValueFilter] = filterPath(ValueFilter.apply _)
  implicit val cubeQueryComponentFilter: Reads[DataCubeQueryComponentFilter] = (
    (JsPath \ "componentUri").read[String] and
      (JsPath \ "type").read[String] and
      (JsPath \ "values").read[Seq[ValueFilter]] and
      (JsPath \ "isActive").readNullable[Boolean]
    )(DataCubeQueryComponentFilter.apply _)
  implicit val cubeQueryFiltersReads: Reads[DataCubeQueryFilter] = (
    (JsPath \ "dsdUri").readNullable[String] and
      (JsPath \ "components").read[Seq[DataCubeQueryComponentFilter]]
    )(DataCubeQueryFilter.apply _)

  implicit val cubeQueryReads: Reads[DataCubeQueryData] = (JsPath \ "filters").read[DataCubeQueryFilter].map(DataCubeQueryData)

  implicit val polygonQueryReads: Reads[WKTQueryData] = (JsPath \ "filters").read[Map[String, Seq[ValueFilter]]].map(WKTQueryData)

  def jsonCacheKey(id: Long, token: String) = "/visualizations/" + id + "/" + token
}
