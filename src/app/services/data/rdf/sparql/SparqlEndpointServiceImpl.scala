package services.data.rdf.sparql

import com.hp.hpl.jena.query.{QueryExecution, QueryExecutionFactory}
import data.models.DataSourceRow
import scaldi.Injector
import services.data.rdf.sparql.extractor.{QueryExecutionResultExtractor, SparqlResultExtractor}
import services.data.rdf.sparql.jena.{QueryExecutionLang, JenaLangRdfXml, SelectLang, SparqlResultLang}
import services.data.rdf.sparql.query.SparqlQuery
import services.data.rdf.sparql.transformer.RdfXmlJenaModelTransformer
import scala.collection.JavaConversions._

class SparqlEndpointServiceImpl(implicit inj: Injector) extends SparqlEndpointService {

  def getSparqlQueryResult[Q <: SparqlQuery, D <: SparqlResultLang, R](dataSource: DataSourceRow, query: Q, extractor: SparqlResultExtractor[Q, D, R]): R = {
    executeQuery[D](dataSource, query, extractor.getLang).map { data =>
      extractor.extract(data)
    }.getOrElse {
      throw new Exception
    }
  }

  private def executeQuery[D <: SparqlResultLang](dataSource: DataSourceRow, query: SparqlQuery, lang: D): Option[SparqlResult[D]] = {
    GenericSparqlEndpoint(dataSource).executeQuery[D](query, lang)
  }

  def getSelectQueryResult[Q <: SparqlQuery, R](dataSource: DataSourceRow, query: Q, extractor: QueryExecutionResultExtractor[Q, R]): R = {
    extractor.extract(executeJena(dataSource, query))
  }

  private def executeJena(dataSource: DataSourceRow, query: SparqlQuery): QueryExecution = {
    val sparqlEndpoint = GenericSparqlEndpoint(dataSource)
    QueryExecutionFactory.sparqlService(sparqlEndpoint.endpointURL, query.get, sparqlEndpoint.namedGraphs, List())
  }

  def query(endpoint: SparqlEndpoint, query: SparqlQuery): com.hp.hpl.jena.query.Dataset = {
    val t = new RdfXmlJenaModelTransformer
    endpoint.executeQuery[JenaLangRdfXml](query, t.getLang).map(t.transform).getOrElse(throw new Exception)
  }

}
