package model.rdf.sparql.rgml.extractor

import java.util.Date
import java.text.SimpleDateFormat
import scala.collection.JavaConversions._
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.Event
import model.rdf.sparql.rgml.query.EventQuery
import org.apache.jena.query.{QueryExecution, QuerySolution}

class EventExtractor extends QueryExecutionResultExtractor[EventQuery, Seq[Event]] {

  def extract(input: QueryExecution): Option[Seq[Event]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => new Event(
        e.getResource("event").getURI,
        e.getLiteral("name").getString,
        getDate(e, "start"),
        getDate(e, "end"),
        e.getResource("link").getURI
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }

  private def getDate(qs: QuerySolution, fieldName: String): Date = {
    val dateFormat = new SimpleDateFormat("YYYY-MM-DD")
    val fieldValue = qs.getLiteral(fieldName).getString()
    if (!fieldValue.isEmpty()) dateFormat.parse(fieldValue) else new Date
  }
}