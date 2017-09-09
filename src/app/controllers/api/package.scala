package controllers

import akka.actor.Props
import model.actor.CheckCompatibilityResponse
import model.entity._
import model.rdf.sparql.ValueFilter
import model.rdf.sparql.datacube._
import model.rdf.sparql.fresnel.{Lens, ResourceThroughLens}
import model.rdf.sparql.geo.models._
import model.rdf.sparql.rgml.models._
import model.rdf.sparql.timeline.models._
import model.rdf.sparql.visualization.{Concept, HierarchyNode, Scheme}
import model.rdf.{Count, LocalizedValue, Property}
import model.service.component.DataReference
import play.api.Play.current
import play.api.db
import play.api.db.slick._
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.mvc.WebSocket
import utils.PaginationInfo

package object api {

  def jsonCacheKey(id: Long, token: String) = "/pipelines/" + id + "/" + token

  def withWebSocket(action: Props => Session => Unit) = WebSocket.acceptWithActor[JsValue, JsValue] { request =>
    jsLogger =>
      val session = db.slick.DB.createSession()
      val logger = ProgressReporter.props(jsLogger)

      action(logger)(session)

      session.close()
      logger
  }

  object JsonImplicits {

    implicit val idWrites: Writes[CustomUnicornPlay.BaseId] = Writes {
      typedId => JsNumber(typedId.id)
    }

    implicit val specificComponentWrites: Writes[(Option[SpecificComponentTemplate], ComponentTemplate)] = Writes { case (sc, c) =>
      JsObject(Seq(
        "id" -> Json.toJson(sc.map(_.id)),
        "componentType" -> Json.toJson(sc.map(_.componentType.toString)),
        "componentTemplate" -> Json.toJson(c)
      ))
    }

    implicit lazy val hierarchyWrites: Writes[HierarchyNode] = (
      (__ \ "name").write[LocalizedValue] and
        (__ \ "uri").write[String] and
        (__ \ "size").writeNullable[Int] and
        (__ \ "children").lazyWriteNullable(Writes.seq[HierarchyNode](hierarchyWrites))
      ) (unlift(HierarchyNode.unapply))

    implicit val pipelineDiscoveryWrites = Json.writes[PipelineDiscovery]
    implicit val pipelineCompatibilityCheckWrites = Json.writes[DataPortBindingSetCompatibilityCheck]
    implicit val featureCompatibilityCheckWrites = Json.writes[FeatureCompatibilityCheck]
    implicit val componentInstanceCompatibilityCheckWrites = Json.writes[ComponentInstanceCompatibilityCheck]
    implicit val descriptorCompatibilityCheckWrites = Json.writes[DescriptorCompatibilityCheck]
    implicit val portCompatibilityCheckWrites = Json.writes[PortCheckResult]
    implicit val descriptorWrites = Json.writes[Descriptor]
    implicit val featureWrites = Json.writes[Feature]
    implicit val portWrites = Json.writes[DataPortTemplate]
    implicit val compatibilityResponseWrites = Json.writes[CheckCompatibilityResponse]
    implicit val dataReferenceWrites = Json.writes[DataReference]

    implicit val localizedLiteralWrites = Json.writes[LocalizedValue]

    implicit val skosConceptWrites = Json.writes[Concept]
    implicit val skosSchemeWrites = Json.writes[Scheme]

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
    implicit val valueFilterWrites = Json.writes[ValueFilter]
    implicit val dataCubeQueryComponentFilterWrites = Json.writes[DataCubeQueryComponentFilter]
    implicit val dataCubeQueryFilterWrites = Json.writes[DataCubeQueryFilter]
    implicit val dataCubeQueryDataWrites = Json.writes[DataCubeQueryData]

    implicit val pipelinesWrites = Json.writes[Pipeline]
    implicit val pipelineEvaluationWrites = Json.writes[PipelineEvaluation]

    implicit val dataSourceWrites = Json.writes[DataSourceTemplate]

    implicit val coordinatesWrites = Json.writes[Coordinate]
    implicit val polygonWrites = Json.writes[Polygon]
    implicit val polygonEntitiesWrites = Json.writes[WKTEntity]
    implicit val propertyWrites = Json.writes[Property]

    implicit val visualizerWrites = Json.writes[ComponentTemplate]
    implicit val coordWrites = Json.writes[Coordinates]
    implicit val markerWrites = Json.writes[Marker]
    implicit val fullCoordinatesWrites = Json.writes[FullCoordinates]
    implicit val geoPlaceWrites = Json.writes[Place]
    implicit val geoQuantifiedThingWrites = Json.writes[QuantifiedThing]
    implicit val geoQuantifiedPlaceWrites = Json.writes[QuantifiedPlace]

    implicit val graphWrites = Json.writes[Graph]
    implicit val nodeWrites = Json.writes[Node]
    implicit val nodeWithDegreeWrites = Json.writes[NodeWithDegree]
    implicit val edgeWrites = Json.writes[Edge]
    implicit val lensWrites = Json.writes[Lens]
    implicit val resourceThroughLensWrites = Json.writes[ResourceThroughLens]

    implicit val countWrites = Json.writes[Count]
    implicit val intervalWrites = Json.writes[Interval]
    implicit val instantWrites = Json.writes[Instant]
    implicit val connectonWrites = Json.writes[TimeLineConnection]

    val filterPath = (JsPath \ "label").readNullable[String] and
      (JsPath \ "dataType").readNullable[String] and
      (JsPath \ "uri").readNullable[String] and
      (JsPath \ "isActive").readNullable[Boolean]

    implicit val valueFilterReads: Reads[ValueFilter] = filterPath(ValueFilter.apply _)
    implicit val cubeQueryComponentFilter: Reads[DataCubeQueryComponentFilter] = (
      (JsPath \ "componentUri").read[String] and
        (JsPath \ "type").read[String] and
        (JsPath \ "values").read[Seq[ValueFilter]] and
        (JsPath \ "isActive").readNullable[Boolean] and
        (JsPath \ "order").readNullable[Int]
      ) (DataCubeQueryComponentFilter.apply _)
    implicit val cubeQueryFiltersReads: Reads[DataCubeQueryFilter] = (
      (JsPath \ "components").read[Seq[DataCubeQueryComponentFilter]] and
        (JsPath \ "datasetUri").read[String]
      ) (DataCubeQueryFilter.apply _)

    implicit val cubeQueryReads: Reads[DataCubeQueryData] = (JsPath \ "filters").read[DataCubeQueryFilter].map(DataCubeQueryData)

    implicit val polygonQueryReads: Reads[MapQueryData] = (JsPath \ "filters").read[Map[String, Seq[ValueFilter]]].map(MapQueryData)

    implicit val paginationInfoReads: Reads[PaginationInfo] = (
      (JsPath \ "skipCount").read[Int] and
        (JsPath \ "pageSize").read[Int]
      ) (PaginationInfo.apply _)
  }

}
