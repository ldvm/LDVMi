package model.rdf.sparql.timeline.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.timeline.models.Connection
import model.rdf.sparql.timeline.query.ThingsWithThingsWithInstantQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class ThingToThingWithInstantConnectionExtractor
  extends QueryExecutionResultExtractor[ThingsWithThingsWithInstantQuery, Seq[Connection]] {

  def extract(input: QueryExecution): Option[Seq[Connection]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => new Connection(
        e.getResource("outerThing").getURI,
        e.getResource("outerThingType").getURI,
        e.getResource("connection").getURI,
        e.getResource("innerThing").getURI
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}