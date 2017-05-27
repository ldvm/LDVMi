package model.rdf.sparql.geo

import model.entity.PipelineEvaluation
import model.rdf.{Count, SparqlService}

trait GeoCountService extends SparqlService {

  def coordinates(evaluation: PipelineEvaluation, coordinatesUrls: Seq[String], limit: Int): Option[Count]

  def places(evaluation: PipelineEvaluation, placeUrls: Seq[String], placeTypes: Seq[String], limit: Int): Option[Count]

  def thingsWithPlaces(evaluation: PipelineEvaluation, thingsUrls: Seq[String], thingsTypes: Seq[String], connections: Seq[String], limit: Int): Option[Count]

  def quantifiedValues(evaluation: PipelineEvaluation, thingsUrls: Seq[String], connections: Seq[String], limit: Int): Option[Count]

}
