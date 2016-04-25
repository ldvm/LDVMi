package model.rdf.sparql.rgml.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.Graph
import model.rdf.sparql.rgml.query.GraphQuery
import org.apache.jena.query.QueryExecution


class GraphExtractor extends QueryExecutionResultExtractor[GraphQuery, Graph] {

  def extract(input: QueryExecution): Option[Graph] = {

    try {
      val resultSet = input.execSelect()

      if (!resultSet.hasNext) return None

      val solution = resultSet.nextSolution()
      Some(Graph(
        solution.getLiteral("directed").getBoolean,
        solution.getLiteral("nodeCount").getInt,
        solution.getLiteral("edgeCount").getInt))
    } catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}
