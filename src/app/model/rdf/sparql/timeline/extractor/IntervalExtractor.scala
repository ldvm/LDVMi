package model.rdf.sparql.timeline.extractor

import java.text.SimpleDateFormat
import java.util.{Date, TimeZone}

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.timeline.models.Interval
import model.rdf.sparql.timeline.query.IntervalQuery
import org.apache.jena.query.{QueryExecution, QuerySolution}

import scala.collection.JavaConversions._

class IntervalExtractor extends QueryExecutionResultExtractor[IntervalQuery, Seq[Interval]] {
  def extract(input: QueryExecution): Option[Seq[Interval]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => new Interval(
        e.getResource("interval").getURI,
        getDate(e, "begin"),
        getDate(e, "end")
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }

  private def getDate(qs: QuerySolution, fieldName: String): Date = {
    val dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")

    // Set time zone
    val zone = qs.getLiteral(fieldName + "_zone")
    val zoneString = if (zone == null) "GMT" else zone.getString
    dateFormat.setTimeZone(TimeZone.getTimeZone(zoneString))

    // Parse optional time
    val hour = qs.getLiteral(fieldName + "_hour")
    val minute = qs.getLiteral(fieldName + "_minute")
    val second = qs.getLiteral(fieldName + "_second")

    val HH = if (hour == null) "00" else hour.getString
    val mm = if (minute == null) "00" else minute.getString
    val ss = if (second == null) "00" else second.getString

    // Parse full date-time value
    val date = qs.getLiteral(fieldName).getString
    return dateFormat.parse(s"""${date} ${HH}:${mm}:${ss}""")
  }
}
