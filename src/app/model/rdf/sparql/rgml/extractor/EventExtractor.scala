package model.rdf.sparql.rgml.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.Event
import model.rdf.sparql.rgml.query.EventQuery
import org.apache.jena.query.QueryExecution
import org.joda.time.DateTime

import scala.collection.JavaConversions._


class EventExtractor extends QueryExecutionResultExtractor[EventQuery, Seq[Event]] {

  def extract(input: QueryExecution): Option[Seq[Event]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => Event(
        e.getLiteral("event").toString(),
        e.getLiteral("eventName").toString(),
        DateTime.parse(e.getLiteral("start").toString()),
        DateTime.parse(e.getLiteral("end").toString()),
        e.getLiteral("eventInfo").toString()
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}