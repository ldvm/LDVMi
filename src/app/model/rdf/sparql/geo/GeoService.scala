package model.rdf.sparql.geo

import model.entity.PipelineEvaluation
import model.rdf.sparql.geo.models._
import model.rdf.{Property, SparqlService}
import play.api.libs.iteratee.Enumerator

trait GeoService extends SparqlService {

  def polygonEntities(evaluation: PipelineEvaluation, queryData: MapQueryData): Option[Enumerator[Option[WKTEntity]]]

  def markers(evaluation: PipelineEvaluation, queryData: MapQueryData): Option[Seq[Marker]]

  def polygonEntitiesProperties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]]

  def properties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]]

  def coordinates(evaluation: PipelineEvaluation, coordinatesUrls: Seq[String], limit: Int): Option[Seq[FullCoordinates]]

  def places(evaluation: PipelineEvaluation, placeUrls: Seq[String], placeTypes: Seq[String], limit: Int): Option[Seq[Place]]

  def quantifiedThings(evaluation: PipelineEvaluation, thingsUrls: Seq[String], valuePredicates: Seq[String], placePredicates: Seq[String], limit: Int): Option[Seq[QuantifiedThing]]

  def quantifiedPlaces(evaluation: PipelineEvaluation, placeUrls: Seq[String], placeTypes: Seq[String], valuePredicates: Seq[String], limit: Int): Option[Seq[QuantifiedPlace]]

}
