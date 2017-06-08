package model.rdf.sparql.timeline.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.timeline.models.TimeLineConnection
import model.rdf.sparql.timeline.query.ThingsWithIntervalQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class ThingToIntervalConnectionExtractor extends QueryExecutionResultExtractor[ThingsWithIntervalQuery, Seq[TimeLineConnection]] {

  def extract(input: QueryExecution): Option[Seq[TimeLineConnection]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => new TimeLineConnection(
        e.getResource("thing").getURI,
        e.getResource("thingType").getURI,
        e.getResource("predicate").getURI,
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
