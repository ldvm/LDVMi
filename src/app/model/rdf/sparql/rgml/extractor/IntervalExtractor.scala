package model.rdf.sparql.rgml.extractor

import java.text.SimpleDateFormat
import java.util.Date

import scala.collection.JavaConversions._
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.models.Interval
import model.rdf.sparql.rgml.query.IntervalQuery
import org.apache.jena.query.{QueryExecution, QuerySolution}

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
    val dateFormat = new SimpleDateFormat("yyyy-MM-dd")
    val fieldValue = qs.getLiteral(fieldName).getString()
    val date =  dateFormat.parse(fieldValue)
    return date;
  }
}
