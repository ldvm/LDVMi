package services.data.rdf.sparql

import data.models.DataSource
import services.data.rdf.sparql.extractor.{QueryExecutionResultExtractor, SparqlResultExtractor}
import services.data.rdf.sparql.jena.{SelectLang, SparqlResultLang}
import services.data.rdf.sparql.query.SparqlQuery

trait SparqlEndpointService {

  def getSparqlQueryResult[Q <: SparqlQuery, D <: SparqlResultLang, R](dataSource: DataSource, query: Q, extractor: SparqlResultExtractor[Q, D, R]): R

  def getSelectQueryResult[Q <: SparqlQuery, R](dataSource: DataSource, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): R

  def query(endpoint: SparqlEndpoint, query: SparqlQuery): com.hp.hpl.jena.query.Dataset

}
