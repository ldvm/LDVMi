package model.rdf.sparql.timeline.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.timeline.models.Connection
import model.rdf.sparql.timeline.query.ThingsWithIntervalQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class ThingToIntervalConnectionExtractor extends QueryExecutionResultExtractor[ThingsWithIntervalQuery, Seq[Connection]] {

  def extract(input: QueryExecution): Option[Seq[Connection]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => new Connection(
        e.getResource("thing").getURI,
        e.getResource("thingType").getURI,
        e.getResource("connection").getURI,
        e.getResource("interval").getURI
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}
