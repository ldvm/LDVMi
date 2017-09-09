package model.rdf.sparql.geo.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.models.Place
import model.rdf.sparql.geo.query.PlaceQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class PlaceExtractor
  extends QueryExecutionResultExtractor[PlaceQuery, Seq[Place]] {

  def extract(input: QueryExecution): Option[Seq[Place]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(qs => new Place(
        qs.getResource("place").getURI,
        qs.getResource("placeType").getURI,
        qs.getResource("coordinates").getURI
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}