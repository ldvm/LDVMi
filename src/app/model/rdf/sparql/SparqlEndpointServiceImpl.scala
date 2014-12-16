package model.rdf.sparql

import _root_.model.entity.DataSourceEagerBox
import _root_.model.rdf.sparql.extractor.QueryExecutionResultExtractor
import _root_.model.rdf.sparql.query.SparqlQuery
import com.hp.hpl.jena.query.QueryExecution
import scaldi.Injector

class SparqlEndpointServiceImpl(implicit inj: Injector) extends SparqlEndpointService {

  def getResult[Q <: SparqlQuery, R](dataSourceEagerBox: DataSourceEagerBox, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): Option[R] = {
    extractor.extract(execution(dataSourceEagerBox, query))
  }

  def execution(dataSource: DataSourceEagerBox, query: SparqlQuery): QueryExecution = {
    GenericSparqlEndpoint(None, None).get.queryExecutionFactory()(query.get)
  }
}
