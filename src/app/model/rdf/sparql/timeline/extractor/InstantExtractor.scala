package model.rdf.sparql.timeline.extractor

import java.text.SimpleDateFormat
import java.util.{Date, TimeZone}

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.timeline.models.Instant
import model.rdf.sparql.timeline.query.InstantQuery
import org.apache.jena.query.{QueryExecution, QuerySolution}

import scala.collection.JavaConversions._

class InstantExtractor extends QueryExecutionResultExtractor[InstantQuery, Seq[Instant]] {

  def extract(input: QueryExecution): Option[Seq[Instant]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => new Instant(
        e.getResource("instant").getURI,
        getDate(e)
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }

  private def getDate(qs: QuerySolution): Date = {
    val dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")

    // Set time zone
    val zone = qs.getLiteral("zone")
    val zoneString = if (zone == null) "GMT" else zone.getString
    dateFormat.setTimeZone(TimeZone.getTimeZone(zoneString))

    // Parse optional time
    val hour = qs.getLiteral("hour")
    val minute = qs.getLiteral("minute")
    val second = qs.getLiteral("second")

    val HH = if (hour == null) "00" else hour.getString
    val mm = if (minute == null) "00" else minute.getString
    val ss = if (second == null) "00" else second.getString

    // Parse full date-time value
    val date = qs.getLiteral("date").getString
    return dateFormat.parse(s"""${date} ${HH}:${mm}:${ss}""")
  }
}