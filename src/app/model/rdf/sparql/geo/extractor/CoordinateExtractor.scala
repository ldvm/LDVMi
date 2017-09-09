package model.rdf.sparql.geo.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.models.FullCoordinates
import model.rdf.sparql.geo.query.CoordinatesQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._
import scala.util.Try

class CoordinateExtractor
  extends QueryExecutionResultExtractor[CoordinatesQuery, Seq[FullCoordinates]] {

  def extract(input: QueryExecution): Option[Seq[FullCoordinates]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(qs => new FullCoordinates(
        qs.getResource("coordinates").getURI(),
        Try(qs.getLiteral("longitude").getString.toDouble).getOrElse(Double.MaxValue),
        Try(qs.getLiteral("latitude").getString.toDouble).getOrElse(Double.MaxValue)
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}