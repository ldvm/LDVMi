package model.rdf.sparql.geo.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.models.QuantifiedThing
import model.rdf.sparql.geo.query.QuantifiedThingQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class QuantifiedThingExtractor
  extends QueryExecutionResultExtractor[QuantifiedThingQuery, Seq[QuantifiedThing]] {

  def extract(input: QueryExecution): Option[Seq[QuantifiedThing]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(qs => new QuantifiedThing(
        qs.getResource("thing").getURI,
        qs.getResource("valuePredicate").getURI,
        qs.getLiteral("value").getInt,
        qs.getResource("placePredicate").getURI,
        qs.getResource("place").getURI
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}