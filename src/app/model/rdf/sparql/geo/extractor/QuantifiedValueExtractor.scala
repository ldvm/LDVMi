package model.rdf.sparql.geo.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.models.Quantifier
import model.rdf.sparql.timeline.query.ThingsWithThingsWithInstantQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._
import scala.util.Try

class QuantifiedValueExtractor
  extends QueryExecutionResultExtractor[ThingsWithThingsWithInstantQuery, Seq[Quantifier]] {

  def extract(input: QueryExecution): Option[Seq[Quantifier]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(qs => new Quantifier(
        qs.getResource("thing").getURI(),
        qs.getResource("connection").getURI(),
        Try(qs.getLiteral("quantifier").getString.toDouble).getOrElse(Double.MaxValue)
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}