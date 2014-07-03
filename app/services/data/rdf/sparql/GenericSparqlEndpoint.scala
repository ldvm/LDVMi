package services.data.rdf.sparql

import java.io.ByteArrayInputStream

import org.apache.jena.riot._
import com.hp.hpl.jena.rdf.model._
import com.hp.hpl.jena.query.ResultSetFormatter
import com.hp.hpl.jena.query._

import services.data.http.HttpStringRetriever
import services.data.rdf.RdfRepresentation

class GenericSparqlEndpoint(val endpointURL: String) {
  def queryUrl(query: String) = endpointURL + "?query=" + java.net.URLEncoder.encode(query, "UTF-8")

  def executeQuery(query: String): com.hp.hpl.jena.query.Dataset = {
    val result = new HttpStringRetriever(queryUrl(query)).retrieve()

    result.map{ data =>
      rdf2JenaDataset(RdfRepresentation.RdfXml, data)
    }.getOrElse{
      throw new Exception
    }
  }

  private def rdf2JenaDataset(representation: RdfRepresentation.Type, data: String): com.hp.hpl.jena.query.Dataset = {
    try {
      val dataInputStream = new ByteArrayInputStream(data.getBytes("UTF-8"))
      val jenaLanguage = representationToJenaLanguage(representation)

      val dataSet = DatasetFactory.createMem()
      RDFDataMgr.read(dataSet, dataInputStream, jenaLanguage)
      dataSet
    } catch {
      case e: org.apache.jena.riot.RiotException => {
        throw new IllegalArgumentException("Query failed, returned non-XML data: "+data.substring(0, 500))
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

