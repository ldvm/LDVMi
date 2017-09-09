package model.rdf.sparql

import _root_.model.rdf.Graph
import _root_.model.rdf.extractor.QueryExecutionResultExtractor
import _root_.model.rdf.Count
import _root_.model.rdf.sparql.query.{SparqlQuery, SparqlCountQuery}
import org.apache.jena.query.{QueryExecution, QueryExecutionFactory}
import org.apache.jena.sparql.engine.http.QueryExceptionHTTP
import scaldi.Injector

import scalaj.http.{Http, HttpOptions}

class SparqlEndpointServiceImpl(implicit inj: Injector) extends SparqlEndpointService {

  def getResult[Q <: SparqlQuery, R](sparqlEndpoint: SparqlEndpoint, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): Option[R] = {
    try {
      extractor.extract(execution(sparqlEndpoint, query))
    } catch {
      case qEx: QueryExceptionHTTP => throw qEx
    }
  }

  def getCount[Q<: SparqlCountQuery](sparqlEndpoint: SparqlEndpoint, query: Q, extractor: QueryExecutionResultExtractor[Q,Count]): Option[Count] = {
    try {
      extractor.extract(count(sparqlEndpoint,query))
    }
    catch {
      case qEx: QueryExceptionHTTP => throw qEx
    }
  }

  def dereference[Q <: SparqlQuery, R](uri: String, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): Option[R] = {
    try {
      val request = Http(uri)
        .timeout(connTimeoutMs = 10000, readTimeoutMs = 30000)
        .header("Accept", "text/turtle")
        .option(HttpOptions.followRedirects(true))

      val response = request.asString

      if (response.code == 303) {
        dereference(response.header("Location").get, query, extractor)
      } else {
        val ttl = response.body
        Graph(ttl).flatMap(g => extractor.extract(QueryExecutionFactory.create(query.get, g.jenaModel)))
      }
    } catch {
      case qEx: QueryExceptionHTTP => throw qEx
      case e => println(e); None
    }
  }

  def execution(sparqlEndpoint: SparqlEndpoint, query: SparqlQuery): QueryExecution = {
    sparqlEndpoint.queryExecutionFactory()(query.get)
  }

  def count(sparqlEndpoint: SparqlEndpoint, query: SparqlCountQuery):QueryExecution = {
    sparqlEndpoint.queryExecutionFactory()(query.getCount)
  }
}
