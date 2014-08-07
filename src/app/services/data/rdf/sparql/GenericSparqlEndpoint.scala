package services.data.rdf.sparql

import java.io.IOException
import data.models.DataSource

import services.data.http.{HttpPostStringRetriever, HttpGetStringRetriever}
import services.data.rdf.sparql.jena.JenaLang
import services.data.rdf.sparql.query.SparqlQuery
import scalaj.http.HttpException

import scala.reflect.ClassTag

class GenericSparqlEndpoint(endpointURL: String, namedGraphs: Seq[String] = List()) extends SparqlEndpoint {

  def executeQuery[D <: JenaLang](query: SparqlQuery, lang: D): Option[SparqlResult[D]] = {
    try {
      val result = new HttpPostStringRetriever(queryUrl(query), params(query), lang.acceptType).retrieve()
      result.map(wrapResult[D])
    } catch {
      case e: HttpException => throw new BadQueryException(e)
      case e: IOException if e.getMessage.contains("Server returned HTTP response code: 400 for URL") =>
        throw new BadQueryException(e, Some("The SPARQL endpoint is unable to parse the query"))
      case e: IOException if e.getMessage.contains("Server returned HTTP response code: 406 for URL") =>
        throw new NotAcceptableException(e, Some("The SPARQL endpoint is unable to provide requested content type"))
    }
  }

  private def wrapResult[D <: JenaLang](data: String): SparqlResult[D] = {
    new SparqlResult[D](data)
  }

  private def queryUrl(query: SparqlQuery) = {
    endpointURL
  }

  private def params(query: SparqlQuery) = {
    List("query" -> query.get) ++ namedGraphUrlString
  }

  private def namedGraphUrlString: Seq[(String, String)] = {
    if (namedGraphs.size > 0) {
      namedGraphs.map(g => "default-graph-uri" -> g)
    } else {
      List()
    }
  }

}

object GenericSparqlEndpoint {
  def apply(dataSource: DataSource) = {
    new GenericSparqlEndpoint(dataSource.endpointUrl, dataSource.namedGraphs.map { s => s.split("\n").toList }.getOrElse(List()))
  }
}

