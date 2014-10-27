package model.services.rdf.sparql

import _root_.model.dao.DataSource
import com.hp.hpl.jena.query.QueryExecution
import extractor.{QueryExecutionResultExtractor, SparqlResultExtractor}
import jena.SparqlResultLang
import query.SparqlQuery

trait SparqlEndpointService {

  def getSparqlQueryResult[Q <: SparqlQuery, D <: SparqlResultLang, R](dataSource: DataSource, query: Q, extractor: SparqlResultExtractor[Q, D, R]): R

  def getResult[Q <: SparqlQuery, R](dataSource: DataSource, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): R

  def query(endpoint: SparqlEndpoint, query: SparqlQuery): com.hp.hpl.jena.query.Dataset

  def constructExecution(dataSource: DataSource, query: SparqlQuery): QueryExecution

}
