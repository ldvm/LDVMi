package model.rdf.sparql

import _root_.model.entity.DataSourceTemplateEagerBox
import _root_.model.rdf.extractor.QueryExecutionResultExtractor
import _root_.model.rdf.sparql.query.SparqlQuery
import com.hp.hpl.jena.query.QueryExecution
import com.hp.hpl.jena.sparql.engine.http.QueryExceptionHTTP
import scaldi.Injector

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

  def execution(sparqlEndpoint: SparqlEndpoint, query: SparqlQuery): QueryExecution = {
    sparqlEndpoint.queryExecutionFactory()(query.get)
  }
}
