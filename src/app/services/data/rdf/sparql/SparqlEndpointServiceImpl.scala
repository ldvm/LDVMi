package services.data.rdf.sparql

import scaldi.Injector
import data.models.DataSource
import services.data.rdf.sparql.extractor.SparqlResultExtractor
import services.data.rdf.sparql.jena.{JenaLangRdfXml, JenaLang}
import services.data.rdf.sparql.query.SparqlQuery
import services.data.rdf.sparql.transformer.RdfXmlJenaModelTransformer

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
    val t = new RdfXmlJenaModelTransformer
    endpoint.executeQuery[JenaLangRdfXml](query).map(t.transform).getOrElse(throw new Exception)
  }

}
