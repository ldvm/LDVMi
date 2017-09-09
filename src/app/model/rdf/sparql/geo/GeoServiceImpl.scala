package model.rdf.sparql.geo

import _root_.model.service.SessionScoped
import model.entity.PipelineEvaluation
import model.rdf.Property
import model.rdf.sparql.SparqlEndpointService
import model.rdf.sparql.geo.extractor._
import model.rdf.sparql.geo.models._
import model.rdf.sparql.geo.query._
import play.api.libs.iteratee.Enumerator
import scaldi.{Injectable, Injector}

class GeoServiceImpl(implicit val inj: Injector) extends GeoService with SessionScoped with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def polygonEntities(evaluation: PipelineEvaluation, queryData: MapQueryData): Option[Enumerator[Option[WKTEntity]]] = {
    runQuery(evaluation, new WKTEntitiesQuery(queryData), new WKTEntitiesExtractor(queryData))()
  }

  def markers(evaluation: PipelineEvaluation, queryData: MapQueryData): Option[Seq[Marker]] = {
    runQuery(evaluation, new MarkerQuery(queryData), new MarkerExtractor(queryData))()
  }

  def polygonEntitiesProperties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]] = {
    runQuery(evaluation, new PolygonEntitiesPropertiesQuery, new PolygonEntitiesPropertiesExtractor)()
  }

  def properties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]] = {
    runQuery(evaluation, new GeoPropertiesQuery, new GeoPropertiesExtractor)()
  }

  def coordinates(evaluation: PipelineEvaluation, coordinatesUrls: Seq[String], limit: Int): Option[Seq[FullCoordinates]] = {
    val maybeCoordUrls = if (coordinatesUrls.size > 0) Some(coordinatesUrls) else None
    val maybeLimit = if (limit > 0) Some(limit) else None

    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new CoordinatesQuery(maybeCoordUrls, maybeLimit), new CoordinateExtractor)
  }

  def places(evaluation: PipelineEvaluation, placeUrls: Seq[String], placeTypes: Seq[String], limit: Int): Option[Seq[Place]] = {
    val maybePlaceUrls = if (placeUrls.size > 0) Some(placeUrls) else None
    val maybePlaceTypes = if (placeTypes.size > 0) Some(placeTypes) else None
    val maybeLimit = if (limit > 0) Some(limit) else None

    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new PlaceQuery(maybePlaceUrls, maybePlaceTypes, maybeLimit), new PlaceExtractor)
  }

  def quantifiedThings(evaluation: PipelineEvaluation, thingsUrls: Seq[String], valuePredicates: Seq[String], placePredicates: Seq[String], limit: Int): Option[Seq[QuantifiedThing]] = {
    val maybeThingsUrls = if (thingsUrls.size > 0) Some(thingsUrls) else None
    val maybeValuePredicates = if (valuePredicates.size > 0) Some(valuePredicates) else None
    val maybePlacePredicates = if (placePredicates.size > 0) Some(placePredicates) else None
    val maybeLimit = if (limit > 0) Some(limit) else None

    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new QuantifiedThingQuery(maybeThingsUrls, maybeValuePredicates, maybePlacePredicates, maybeLimit), new QuantifiedThingExtractor)
  }

  def quantifiedPlaces(evaluation: PipelineEvaluation, placeUrls: Seq[String], placeTypes: Seq[String], valuePredicates: Seq[String], limit: Int): Option[Seq[QuantifiedPlace]] = {
    val maybePlaceUrls = if (placeUrls.size > 0) Some(placeUrls) else None
    val maybePlaceTypes = if (placeTypes.size > 0) Some(placeTypes) else None
    val maybeValuePredicates = if (valuePredicates.size > 0) Some(valuePredicates) else None
    val maybeLimit = if (limit > 0) Some(limit) else None

    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new QuantifiedPlaceQuery(maybePlaceUrls, maybePlaceTypes, maybeValuePredicates, maybeLimit), new QuantifiedPlaceExtractor)
  }
}
