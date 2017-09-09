package model.rdf.sparql.geo.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.models.QuantifiedPlace
import model.rdf.sparql.geo.query.QuantifiedPlaceQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class QuantifiedPlaceExtractor
  extends QueryExecutionResultExtractor[QuantifiedPlaceQuery, Seq[QuantifiedPlace]] {

  def extract(input: QueryExecution): Option[Seq[QuantifiedPlace]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(qs => new QuantifiedPlace(
        qs.getResource("place").getURI,
        qs.getResource("placeType").getURI,
        qs.getResource("valuePredicate").getURI,
        qs.getLiteral("value").getInt,
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