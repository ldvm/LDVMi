package model.rdf.sparql

import _root_.model.rdf.extractor.QueryExecutionResultExtractor
import _root_.model.rdf.sparql.query.{SparqlCountQuery, SparqlQuery}
import _root_.model.rdf.Count

trait SparqlEndpointService {

  def getResult[Q <: SparqlQuery, R](sparqlEndpoint: SparqlEndpoint, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): Option[R]

  def getCount[Q<: SparqlCountQuery](sparqlEndpoint: SparqlEndpoint, query: Q, extractor: QueryExecutionResultExtractor[Q,Count]): Option[Count]

  def dereference[Q <: SparqlQuery, R](uri: String, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): Option[R]
}
