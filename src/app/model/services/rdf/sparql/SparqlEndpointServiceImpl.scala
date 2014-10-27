package model.services.rdf.sparql

import _root_.model.dao.DataSource
import _root_.model.services.rdf.sparql.extractor.{QueryExecutionResultExtractor, SparqlResultExtractor}
import _root_.model.services.rdf.sparql.jena.{JenaLangRdfXml, SparqlResultLang}
import _root_.model.services.rdf.sparql.query.SparqlQuery
import _root_.model.services.rdf.sparql.transformer.RdfXmlJenaModelTransformer
import com.hp.hpl.jena.query.{QueryExecution, QueryExecutionFactory}
import scaldi.Injector
import scala.collection.JavaConversions._

class SparqlEndpointServiceImpl(implicit inj: Injector) extends SparqlEndpointService {

  def getSparqlQueryResult[Q <: SparqlQuery, D <: SparqlResultLang, R](dataSource: DataSource, query: Q, extractor: SparqlResultExtractor[Q, D, R]): R = {
    executeQuery[D](dataSource, query, extractor.getLang).map { data =>
      extractor.extract(data)
    }.getOrElse {
      throw new Exception
    }
  }

  def getResult[Q <: SparqlQuery, R](dataSource: DataSource, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): R = {
    extractor.extract(constructExecution(dataSource, query))
  }

  private def executeQuery[D <: SparqlResultLang](dataSource: DataSource, query: SparqlQuery, lang: D): Option[SparqlResult[D]] = {
    GenericSparqlEndpoint(dataSource).executeQuery[D](query, lang)
  }

  def constructExecution(dataSource: DataSource, query: SparqlQuery): QueryExecution = {
    val sparqlEndpoint = GenericSparqlEndpoint(dataSource)
    QueryExecutionFactory.sparqlService(sparqlEndpoint.endpointURL, query.get, sparqlEndpoint.namedGraphs, List())
  }

  def query(endpoint: SparqlEndpoint, query: SparqlQuery): com.hp.hpl.jena.query.Dataset = {
    val t = new RdfXmlJenaModelTransformer
    endpoint.executeQuery[JenaLangRdfXml](query, t.getLang).map(t.transform).getOrElse(throw new Exception)
  }

}
