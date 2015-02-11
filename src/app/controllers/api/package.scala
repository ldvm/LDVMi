package controllers

import akka.actor.Props
import model.actor.CheckCompatibilityResponse
import model.entity._
import model.rdf.sparql.ValueFilter
import model.rdf.sparql.datacube._
import model.rdf.sparql.geo._
import model.rdf.{LocalizedValue, Property}
import play.api.db
import play.api.db.slick._
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.mvc.WebSocket
import play.api.Play.current

package object api {

  def jsonCacheKey(id: Long, token: String) = "/pipelines/" + id + "/" + token

  def withWebSocket(action: Props => Session => Unit) = WebSocket.acceptWithActor[JsValue, JsValue] { request => jsLogger =>
    val session = db.slick.DB.createSession()
    val logger = ProgressReporter.props(jsLogger)

    action(logger)(session)

    session.close()
    logger
  }

  object JsonImplicits {

    implicit val idWrites : Writes[CustomUnicornPlay.BaseId] = Writes {
      typedId => JsNumber(typedId.id)
    }

    implicit val pipelineDiscoveryWrites = Json.writes[PipelineDiscovery]
    implicit val pipelineCompatibilityCheckWrites = Json.writes[DataPortBindingSetCompatibilityCheck]
    implicit val featureCompatibilityCheckWrites = Json.writes[FeatureCompatibilityCheck]
    implicit val componentInstanceCompatibilityCheckWrites = Json.writes[ComponentInstanceCompatibilityCheck]
    implicit val descriptorCompatibilityCheckWrites = Json.writes[DescriptorCompatibilityCheck]
    implicit val descriptorWrites = Json.writes[Descriptor]
    implicit val compatibilityResponseWrites = Json.writes[CheckCompatibilityResponse]

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
    implicit val dataCubeWrites = Json.writes[model.rdf.sparql.datacube.DataCube]
    implicit val dataCubeQueryResultWrites = Json.writes[DataCubeQueryResult]

    implicit val pipelinesWrites = Json.writes[Pipeline]

    implicit val dataSourceWrites = Json.writes[DataSourceTemplate]

    implicit val coordinatesWrites = Json.writes[Coordinate]
    implicit val polygonWrites = Json.writes[Polygon]
    implicit val polygonEntitiesWrites = Json.writes[WKTEntity]
    implicit val propertyWrites = Json.writes[Property]

    implicit val visualizerWrites = Json.writes[ComponentTemplate]
    //implicit val visualizerCompatibilityWrites = Json.writes[ComponentCompatibility]

    /*implicit val visualizationEagerBoxWrites: Writes[VisualizationEagerBox] = Writes {
      visualizationEagerBox =>
        JsObject(
          Seq(
            ("visualization", Json.toJson(visualizationEagerBox.visualization)),
            ("datasource", Json.toJson(visualizationEagerBox.datasource)),
            ("token", Json.toJson(visualizationEagerBox.token))
          )
        )
    }

    implicit val visualizerCompatibilityEagerBoxWrites: Writes[ComponentCompatibilityEagerBox] = Writes {
      visualizationEagerBox =>
        JsObject(
          Seq(
            ("visualizerCompatibility", Json.toJson(visualizationEagerBox.visualizerCompatibility)),
            ("visualizer", Json.toJson(visualizationEagerBox.visualizer))
          )
        )
    }*/


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
  }

}
