package model.rdf.sparql

import _root_.model.rdf.Graph
import _root_.model.rdf.extractor.QueryExecutionResultExtractor
import _root_.model.rdf.sparql.query.SparqlQuery
import org.apache.jena.query.{QueryExecutionFactory, QueryExecution}
import org.apache.jena.sparql.engine.http.QueryExceptionHTTP
import scaldi.Injector

import scalaj.http.{HttpOptions, Http}

class SparqlEndpointServiceImpl(implicit inj: Injector) extends SparqlEndpointService {

  def getResult[Q <: SparqlQuery, R](sparqlEndpoint: SparqlEndpoint, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): Option[R] = {
    try {
      extractor.extract(execution(sparqlEndpoint, query))
    } catch {
      case qEx : QueryExceptionHTTP => {
        throw qEx
      }
    }
  }

  def dereference[Q <: SparqlQuery, R](uri: String, query: Q, extractor: QueryExecutionResultExtractor[Q, R]) : Option[R] = {
    try {
      val response = Http(uri).timeout(connTimeoutMs = 1000, readTimeoutMs = 5000)
        .header("Accept", "text/turtle")
        .option(HttpOptions.followRedirects(true))
        .asString
      val ttl = response.body
      Graph(ttl).flatMap(g => extractor.extract(QueryExecutionFactory.create(query.get, g.jenaModel)))
    } catch {
      case qEx : QueryExceptionHTTP => {
        throw qEx
      }
    }
  }

  def execution(sparqlEndpoint: SparqlEndpoint, query: SparqlQuery): QueryExecution = {
    sparqlEndpoint.queryExecutionFactory()(query.get)
  }
}
