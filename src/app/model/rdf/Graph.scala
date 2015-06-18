package model.rdf

import java.io._
import java.net.URL
import java.util.UUID

import com.hp.hpl.jena.rdf.model.{ModelFactory}
import org.apache.http.auth.{AuthScope, UsernamePasswordCredentials}
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.StringEntity
import org.apache.http.impl.client.DefaultHttpClient

case class Graph(jenaModel: com.hp.hpl.jena.rdf.model.Model) {

  def union(otherGraphOption: Option[Graph]): Graph = {
    otherGraphOption.map { otherGraph =>
      val newModel = ModelFactory.createDefaultModel()
      newModel.add(jenaModel)
      newModel.add(otherGraph.jenaModel)
      Graph(newModel)
    }.getOrElse(this)
  }

  def mergeWith(otherGraphOption: Option[Graph]): Unit = {
    otherGraphOption.map { otherGraph =>
      jenaModel.add(otherGraph.jenaModel)
    }
  }

  def toRdfXml: String = {
    val sw = new StringWriter()
    jenaModel.write(sw, "RDF/XML", null)
    sw.toString
  }

  def toTTL: String = {
    val sw = new StringWriter()
    jenaModel.write(sw, "N3", null)
    sw.toString
  }

  def pushToRandomGraph : String = {

    val endpoint: String = "http://live.payola.cz:8890"
    val graphUri: String = "urn:"+UUID.randomUUID().toString

    val requestUri = String.format("%s/sparql-graph-crud-auth?graph-uri=%s", endpoint, graphUri)

    val stringData = toTTL

    val credentials = new UsernamePasswordCredentials("dba", "dba")
    val httpClient = new DefaultHttpClient()
    val post = new HttpPost(requestUri)
    post.addHeader("X-Requested-Auth", "Digest")
    try {
      httpClient.getCredentialsProvider.setCredentials(AuthScope.ANY, credentials)
      val stringEntity = new StringEntity(stringData, "UTF-8")
      post.setEntity(stringEntity)
      httpClient.execute(post)

      graphUri
    }
    catch {
      case e: Throwable => throw e
    }
    finally {
      httpClient.getConnectionManager.shutdown()
    }
  }

}

object Graph {

  private val defaultRdfLang = "N3"

  def apply(url: URL): Option[Graph] = {
    try {
      val model = ModelFactory.createDefaultModel()
      model.read(url.toExternalForm, null, defaultRdfLang)
      Some(Graph(model))
    } catch {
      case t: Throwable => None
    }
  }

  def apply(rdfOption: Option[String]): Option[Graph] = {
    rdfOption match {
      case None => None
      case Some(rdf) => Graph(rdf)
    }
  }

  def apply(rdf: String): Option[Graph] = {
    try {
      val jenaModel = ModelFactory.createDefaultModel()
      jenaModel.read(new StringReader(rdf), null, defaultRdfLang)
      Some(new Graph(jenaModel))
    } catch {
      case e: Throwable => None
    }
  }

  def apply(jenaModel: com.hp.hpl.jena.rdf.model.Model, lang: String = defaultRdfLang): Option[Graph] = {
    Some(new Graph(jenaModel))
  }

  def apply(file: File): Option[Graph] = {
    try {
      val jenaModel = ModelFactory.createDefaultModel()
      jenaModel.read(new FileInputStream(file), null, defaultRdfLang)
      Some(Graph(jenaModel))
    } catch {
      case e: Throwable => None
    }
  }
}
