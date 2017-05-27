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

  def places(evaluation: PipelineEvaluation, placeUrls: Seq[String], placeTypes: Seq[String], limit: Int): Option[Seq[GeoConnection]]

  def thingsWithPlaces(evaluation: PipelineEvaluation, thingsUrls: Seq[String], thingsTypes: Seq[String], connections: Seq[String], limit: Int): Option[Seq[GeoConnection]]

  def quantifiedValues(evaluation: PipelineEvaluation, thingsUrls: Seq[String], connections: Seq[String], limit: Int): Option[Seq[Quantifier]]

}
