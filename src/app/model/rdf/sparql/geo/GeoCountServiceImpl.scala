package model.rdf.sparql.geo

import _root_.model.service.SessionScoped
import model.entity.PipelineEvaluation
import model.rdf.Count
import model.rdf.sparql.SparqlEndpointService
import model.rdf.sparql.extractor.CountExtractor
import model.rdf.sparql.geo.query.{CoordinatesQuery, PlaceQuery, QuantifiedPlaceQuery, QuantifiedThingQuery}
import scaldi.{Injectable, Injector}

class GeoCountServiceImpl(implicit val inj: Injector) extends GeoCountService with SessionScoped with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def coordinates(evaluation: PipelineEvaluation, coordinatesUrls: Seq[String], limit: Int): Option[Count] = {
    val maybeCoordUrls = if (coordinatesUrls.size > 0) Some(coordinatesUrls) else None
    val maybeLimit = if (limit > 0) Some(limit) else None

    sparqlEndpointService.getCount(evaluationToSparqlEndpoint(evaluation), new CoordinatesQuery(maybeCoordUrls, maybeLimit), new CountExtractor)
  }

  def places(evaluation: PipelineEvaluation, placeUrls: Seq[String], placeTypes: Seq[String], limit: Int): Option[Count] = {
    val maybePlaceUrls = if (placeUrls.size > 0) Some(placeUrls) else None
    val maybePlaceTypes = if (placeTypes.size > 0) Some(placeTypes) else None
    val maybeLimit = if (limit > 0) Some(limit) else None

    sparqlEndpointService.getCount(evaluationToSparqlEndpoint(evaluation), new PlaceQuery(maybePlaceUrls, maybePlaceTypes, maybeLimit), new CountExtractor)
  }

  def quantifiedThings(evaluation: PipelineEvaluation, thingsUrls: Seq[String], valueConnections: Seq[String], placeConnections: Seq[String], limit: Int): Option[Count] = {
    val maybeThingsUrls = if (thingsUrls.size > 0) Some(thingsUrls) else None
    val maybeValueConnections = if (valueConnections.size > 0) Some(valueConnections) else None
    val maybePlaceConnections = if (placeConnections.size > 0) Some(placeConnections) else None
    val maybeLimit = if (limit > 0) Some(limit) else None

    sparqlEndpointService.getCount(evaluationToSparqlEndpoint(evaluation), new QuantifiedThingQuery(maybeThingsUrls, maybeValueConnections, maybePlaceConnections, maybeLimit), new CountExtractor)
  }

  def quantifiedPlaces(evaluation: PipelineEvaluation, placeUrls: Seq[String], placeTypes: Seq[String], valueConnections: Seq[String], limit: Int): Option[Count] = {
    val maybePlaceUrls = if (placeUrls.size > 0) Some(placeUrls) else None
    val maybePlaceTypes = if (placeTypes.size > 0) Some(placeTypes) else None
    val maybeValueConnections = if (valueConnections.size > 0) Some(valueConnections) else None
    val maybeLimit = if (limit > 0) Some(limit) else None

    sparqlEndpointService.getCount(evaluationToSparqlEndpoint(evaluation), new QuantifiedPlaceQuery(maybePlaceUrls, maybePlaceTypes, maybeValueConnections, maybeLimit), new CountExtractor)
  }
}
