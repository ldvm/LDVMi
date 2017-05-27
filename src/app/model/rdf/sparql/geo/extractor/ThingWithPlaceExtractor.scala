package model.rdf.sparql.geo.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.models.GeoConnection
import model.rdf.sparql.geo.query.ThingWithPlaceQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class ThingWithPlaceExtractor
  extends QueryExecutionResultExtractor[ThingWithPlaceQuery, Seq[GeoConnection]] {

  def extract(input: QueryExecution): Option[Seq[GeoConnection]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(qs => new GeoConnection(
        qs.getResource("thing").getURI(),
        qs.getResource("thingType").getURI(),
        qs.getResource("connection").getURI(),
        qs.getResource("place").getURI()
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}