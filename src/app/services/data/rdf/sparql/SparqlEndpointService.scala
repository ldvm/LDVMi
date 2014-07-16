package services.data.rdf.sparql

import data.models.DataSource
import services.data.rdf.sparql.extractor.SparqlResultExtractor
import services.data.rdf.sparql.jena.JenaLang
import services.data.rdf.sparql.query.SparqlQuery

trait SparqlEndpointService {

  def getSparqlQueryResult[Q <: SparqlQuery, D <: JenaLang, R](dataSource: DataSource, query: Q, extractor: SparqlResultExtractor[Q, D, R]): R

  def query(endpoint: SparqlEndpoint, query: SparqlQuery): com.hp.hpl.jena.query.Dataset

}
