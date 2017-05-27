package model.rdf.sparql.geo.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.models.GeoConnection
import model.rdf.sparql.geo.query.PlaceQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class PlaceExtractor
  extends QueryExecutionResultExtractor[PlaceQuery, Seq[GeoConnection]] {

  def extract(input: QueryExecution): Option[Seq[GeoConnection]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(qs => new GeoConnection(
        qs.getResource("place").getURI(),
        qs.getResource("placeType").getURI(),
        "http://schema.org/geo",
        qs.getResource("coordinates").getURI()
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}