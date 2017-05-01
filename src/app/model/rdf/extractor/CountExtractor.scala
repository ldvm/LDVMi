package model.rdf.sparql.extractor

import model.rdf.Count
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.query.SparqlCountQuery
import org.apache.jena.query.QueryExecution

class CountExtractor extends QueryExecutionResultExtractor[SparqlCountQuery, Count] {

  def extract(input: QueryExecution): Option[Count] = {
    try {
      val resultSet = input.execSelect()
      if (resultSet.hasNext()) {
        Some(new Count(resultSet.next().getLiteral("count").getInt()))
      }
      else None
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}