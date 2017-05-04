package model.rdf.sparql.rgml.extractor

import java.util.Date
import java.text.SimpleDateFormat
import scala.collection.JavaConversions._
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.models.Instant
import model.rdf.sparql.rgml.query.InstantQuery
import org.apache.jena.query.{QueryExecution, QuerySolution}

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
    val dateFormat = new SimpleDateFormat("YYYY-MM-DD")
    val fieldValue = qs.getLiteral(fieldName).getString()
    return dateFormat.parse(fieldValue)
  }
}