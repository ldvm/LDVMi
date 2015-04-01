package model.rdf.extractor

import model.rdf.sparql.jena.{QueryExecutionTypeConstruct, QueryExecutionType}
import model.rdf.sparql.query.SparqlQuery

trait SparqlResultExtractor[Q <: SparqlQuery, QE <: QueryExecutionType, R] extends ResultExtractor[Q, QE, R] {

  def extract(execution: QE): Option[R]

}

trait ConstructResultExtractor[Q <: SparqlQuery, R] extends SparqlResultExtractor[Q, QueryExecutionTypeConstruct, R]
