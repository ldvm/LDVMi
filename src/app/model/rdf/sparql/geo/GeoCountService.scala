package model.rdf.sparql.geo

import model.entity.PipelineEvaluation
import model.rdf.{Count, SparqlService}

trait GeoCountService extends SparqlService {

  def coordinates(evaluation: PipelineEvaluation, coordinatesUrls: Seq[String], limit: Int): Option[Count]

  def places(evaluation: PipelineEvaluation, placeUrls: Seq[String], placeTypes: Seq[String], limit: Int): Option[Count]

  def quantifiedThings(evaluation: PipelineEvaluation, thingsUrls: Seq[String], valueConnections: Seq[String], placeConnections: Seq[String], limit: Int): Option[Count]

  def quantifiedPlaces(evaluation: PipelineEvaluation, placeUrls: Seq[String], placeTypes: Seq[String], valueConnections: Seq[String], limit: Int): Option[Count]

}
