package model.rdf.sparql.geo

import _root_.model.service.SessionScoped
import model.entity.PipelineEvaluation
import model.rdf.Count
import model.rdf.sparql.SparqlEndpointService
import model.rdf.sparql.extractor.CountExtractor
import model.rdf.sparql.geo.query.{CoordinatesQuery, PlaceQuery, QuantifiedValueQuery, ThingWithPlaceQuery}
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

  def thingsWithPlaces(evaluation: PipelineEvaluation, thingsUrls: Seq[String], thingsTypes: Seq[String], connections: Seq[String], limit: Int): Option[Count] = {
    val maybeThingsUrls = if (thingsUrls.size > 0) Some(thingsUrls) else None
    val maybeThingsTypes = if (thingsTypes.size > 0) Some(thingsTypes) else None
    val maybeConnections = if (connections.size > 0) Some(connections) else None
    val maybeLimit = if (limit > 0) Some(limit) else None

    sparqlEndpointService.getCount(evaluationToSparqlEndpoint(evaluation), new ThingWithPlaceQuery(maybeThingsUrls, maybeThingsTypes, maybeConnections, maybeLimit), new CountExtractor)
  }

  def quantifiedValues(evaluation: PipelineEvaluation, thingsUrls: Seq[String], connections: Seq[String], limit: Int): Option[Count] = {
    val maybeThingsUrls = if (thingsUrls.size > 0) Some(thingsUrls) else None
    val maybeConnections = if (connections.size > 0) Some(connections) else None
    val maybeLimit = if (limit > 0) Some(limit) else None

    sparqlEndpointService.getCount(evaluationToSparqlEndpoint(evaluation), new QuantifiedValueQuery(maybeThingsUrls, maybeConnections, maybeLimit), new CountExtractor)
  }
}
