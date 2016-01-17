package model.rdf.sparql.visualization.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.query.ConceptCountQuery
import org.apache.jena.query.QueryExecution

class ConceptCountExtractor extends QueryExecutionResultExtractor[ConceptCountQuery, Int] {

  def extract(input: QueryExecution): Option[Int] = {

    try {
      val resultSet = input.execSelect()
      Some(resultSet.nextSolution().getLiteral("count").getInt)
    } catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }

  }
}
