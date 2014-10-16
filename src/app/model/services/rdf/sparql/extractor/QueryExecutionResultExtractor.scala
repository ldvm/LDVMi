package model.services.rdf.sparql.extractor

import com.hp.hpl.jena.query.QueryExecution
import model.services.rdf.sparql.query.SparqlQuery

trait QueryExecutionResultExtractor[Q <: SparqlQuery, R] extends ResultExtractor[Q, QueryExecution, R] {
  def extract(data: QueryExecution): R
}
