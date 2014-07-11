package services.data.rdf.sparql

import scaldi.{Injector}
import data.models.DataSource
import services.data.rdf.sparql.jena.JenaLang

class SparqlEndpointServiceImpl(implicit inj: Injector) extends SparqlEndpointService {

  def getSparqlQueryResult[Q <: SparqlQuery, D <: JenaLang, R](dataSource: DataSource, query: Q, extractor: SparqlResultExtractor[Q, D, R]): R = {
    executeQuery[D](dataSource, query).map { data =>
      extractor.extract(data)}.getOrElse {
      throw new Exception
    }
  }

  def executeQuery[D <: JenaLang](dataSource: DataSource, query: SparqlQuery): Option[SparqlResult[D]] = {
    GenericSparqlEndpoint(dataSource).executeQuery[D](query)
  }

  def query(endpoint: SparqlEndpoint, query: SparqlQuery): com.hp.hpl.jena.query.Dataset = {
    endpoint.executeQuery(query.get)
  }

}
