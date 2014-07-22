package services.data.rdf.sparql

import java.io.IOException
import data.models.DataSource

import services.data.http.HttpStringRetriever
import services.data.rdf.sparql.jena.JenaLang
import services.data.rdf.sparql.query.SparqlQuery

import scala.reflect.ClassTag

class GenericSparqlEndpoint(endpointURL: String, namedGraphs: Seq[String] = List()) extends SparqlEndpoint {

  def executeQuery[D <: JenaLang](query: SparqlQuery, lang: D): Option[SparqlResult[D]] = {
    try {
      val result = new HttpStringRetriever(queryUrl(query), lang.acceptType).retrieve()
      result.map(wrapResult[D])
    } catch {
      case e: IOException if e.getMessage.contains("Server returned HTTP response code: 400 for URL") =>
        throw new BadQueryException(e, Some("The SPARQL endpoint is unable to parse the query"))
      case e: IOException if e.getMessage.contains("Server returned HTTP response code: 406 for URL") =>
        throw new NotAcceptableException(e, Some("The SPARQL endpoint is unable to provide requested content type"))
    }
  }

  private def wrapResult[D <: JenaLang](data: String): SparqlResult[D] = {
    new SparqlResult[D](data)
  }

  private def namedGraphUrlString: Option[String] = {
    if (namedGraphs.size > 0) {
      Some("default-graph-uri=" + namedGraphs.map(java.net.URLEncoder.encode(_, "UTF-8")).mkString("&default-graph-uri="))
    } else {
      None
    }
  }

  private def queryUrl(query: SparqlQuery) = {
    endpointURL + namedGraphUrlString.map { s => "?" + s + "&"}.getOrElse("?") + "query=" + java.net.URLEncoder.encode(query.get, "UTF-8")
  }

}

object GenericSparqlEndpoint {
  def apply(dataSource: DataSource) = {
    new GenericSparqlEndpoint(dataSource.endpointUrl, dataSource.namedGraphs.map { s => s.split("\n").toList}.getOrElse(List()))
  }
}

