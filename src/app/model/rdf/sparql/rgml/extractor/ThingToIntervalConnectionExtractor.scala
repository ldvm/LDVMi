package model.rdf.sparql.rgml.extractor

import scala.collection.JavaConversions._
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.models.Connection
import model.rdf.sparql.rgml.query.ThingsWithIntervalQuery
import org.apache.jena.query.QueryExecution

class ThingToIntervalConnectionExtractor extends QueryExecutionResultExtractor[ThingsWithIntervalQuery, Seq[Connection]] {

  def extract(input: QueryExecution): Option[Seq[Connection]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => new Connection(
        e.getResource("thing").getURI,
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
