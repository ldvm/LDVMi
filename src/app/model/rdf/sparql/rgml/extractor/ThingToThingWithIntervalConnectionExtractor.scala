package model.rdf.sparql.rgml.extractor

import scala.collection.JavaConversions._
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.models.Connection
import org.apache.jena.query.QueryExecution
import model.rdf.sparql.rgml.query.{ThingsWithThingsWithIntervalQuery}

class ThingToThingWithIntervalConnectionExtractor
  extends QueryExecutionResultExtractor[ThingsWithThingsWithIntervalQuery, Seq[Connection]] {

  def extract(input: QueryExecution): Option[Seq[Connection]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => new Connection(
        e.getResource("outerThing").getURI,
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
