package services.data.rdf.sparql.extractor

import com.hp.hpl.jena.query.QueryExecution
import services.data.rdf.sparql.query.SparqlQuery

trait QueryExecutionResultExtractor[Q <: SparqlQuery, R] extends ResultExtractor[Q, QueryExecution, R] {
  def extract(data: QueryExecution): R
}
