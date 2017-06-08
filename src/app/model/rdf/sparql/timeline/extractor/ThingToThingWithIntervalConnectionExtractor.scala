package model.rdf.sparql.timeline.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.timeline.models.TimeLineConnection
import model.rdf.sparql.timeline.query.ThingsWithThingsWithIntervalQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class ThingToThingWithIntervalConnectionExtractor
  extends QueryExecutionResultExtractor[ThingsWithThingsWithIntervalQuery, Seq[TimeLineConnection]] {

  def extract(input: QueryExecution): Option[Seq[TimeLineConnection]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => new TimeLineConnection(
        e.getResource("outerThing").getURI,
        e.getResource("outerThingType").getURI,
        e.getResource("predicate").getURI,
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
