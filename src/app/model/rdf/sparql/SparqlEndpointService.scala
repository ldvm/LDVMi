package model.rdf.sparql

import _root_.model.entity.{DataSourceEagerBox, DataSource}
import com.hp.hpl.jena.query.QueryExecution
import _root_.model.rdf.extractor.{QueryExecutionResultExtractor, SparqlResultExtractor}
import jena.QueryExecutionType
import query.SparqlQuery

trait SparqlEndpointService {

  def getResult[Q <: SparqlQuery, R](dataSourceEagerBox: DataSourceEagerBox, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): Option[R]

}
