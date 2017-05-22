package model.rdf.sparql.timeline.extractor

import java.text.SimpleDateFormat
import java.util.Date

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
        getDate(e, "date")
      )))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }

  private def getDate(qs: QuerySolution, fieldName: String): Date = {
    val dateFormat = new SimpleDateFormat("yyyy-MM-dd")
    val fieldValue = qs.getLiteral(fieldName).getString()
    return dateFormat.parse(fieldValue)
  }
}