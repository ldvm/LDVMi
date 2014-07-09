package services.data.rdf.sparql

import java.io.{IOException, ByteArrayInputStream}

import org.apache.jena.riot._
import com.hp.hpl.jena.query._

import data.models.DataSource

import services.data.http.HttpStringRetriever
import services.data.rdf.RdfRepresentation

class GenericSparqlEndpoint(endpointURL: String, namedGraphs: Seq[String] = List()) extends SparqlEndpoint {

  def executeQuery(query: String): com.hp.hpl.jena.query.Dataset = {
    try {
      val result = new HttpStringRetriever(queryUrl(query), "application/rdf+xml").retrieve()

      result.map { data =>
        rdf2JenaDataset(RdfRepresentation.RdfXml, data)
      }.getOrElse {
        throw new Exception
      }
    } catch {
      case e: IOException if e.getMessage.contains("Server returned HTTP response code: 400 for URL") =>
        throw new BadQueryException(e, Some("The SPARQL endpoint is unable to parse the query"))
      case e: IOException if e.getMessage.contains("Server returned HTTP response code: 406 for URL") =>
        throw new NotAcceptableException(e, Some("The SPARQL endpoint is unable to provide requested content type"))
    }
  }

  private def namedGraphUrlString: Option[String] = {
    if(namedGraphs.size > 0){
      Some("default-graph-uri="+namedGraphs.map(java.net.URLEncoder.encode(_, "UTF-8")).mkString("&default-graph-uri="))
    } else {
      None
    }
  }

  private def queryUrl(query: String) = {
    endpointURL + namedGraphUrlString.map{s => "?"+s+"&" }.getOrElse("?") + "query=" + java.net.URLEncoder.encode(query, "UTF-8")
  }

  private def rdf2JenaDataset(representation: RdfRepresentation.Type, data: String): Dataset = {
    try {
      val dataInputStream = new ByteArrayInputStream(data.getBytes("UTF-8"))
      val jenaLanguage = representationToJenaLanguage(representation)

      val dataSet = DatasetFactory.createMem()
      RDFDataMgr.read(dataSet, dataInputStream, jenaLanguage)
      dataSet
    } catch {
      case e: org.apache.jena.riot.RiotException => {
        throw new IllegalArgumentException("Query failed, returned non-XML data: " + data.substring(0, 500))
      }
      case e: Exception => throw new IllegalArgumentException(e.getMessage)
    }
  }


  private def representationToJenaLanguage(representation: RdfRepresentation.Type) = {
    representation match {
      case RdfRepresentation.RdfXml => Lang.RDFXML
      case RdfRepresentation.Turtle => Lang.TURTLE
      case RdfRepresentation.Trig => Lang.TRIG
    }
  }

}

object GenericSparqlEndpoint {
  def apply(dataSource: DataSource) = {
    new GenericSparqlEndpoint(dataSource.endpointUrl, dataSource.namedGraphs.map { s => s.split("\n").toList}.getOrElse(List()))
  }
}

