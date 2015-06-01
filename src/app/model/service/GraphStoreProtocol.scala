package model.service

import java.io.{File, ByteArrayOutputStream}

import akka.actor.Props
import com.hp.hpl.jena.rdf.model.Model
import model.rdf.Graph
import org.apache.http.auth.{AuthScope, UsernamePasswordCredentials}
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.{ContentType, FileEntity, StringEntity}
import org.apache.http.impl.client.DefaultHttpClient
import play.api.libs.concurrent.Akka
import play.api.Play.current

class GraphStoreProtocol {
  
  val internalEndpointUrl = play.api.Play.configuration.getString("ldvmi.triplestore.push").getOrElse("")

  def pushToTripleStore(file: File, graphUri: String, contentType: Option[String]) = {
    val requestUri = String.format("%s/sparql-graph-crud-auth?graph-uri=%s", internalEndpointUrl.replace("/sparql",""), graphUri)

    println(requestUri)

    val credentials = new UsernamePasswordCredentials("dba", "dba")
    val httpClient = new DefaultHttpClient()
    val post = new HttpPost(requestUri)
    post.addHeader("X-Requested-Auth", "Digest")
    try {
      httpClient.getCredentialsProvider.setCredentials(AuthScope.ANY, credentials)
      val fileEntity = new FileEntity(file, ContentType.create(contentType.getOrElse("text/turtle")))

      post.setEntity(fileEntity)
      val response = httpClient.execute(post)

      if(response.getStatusLine.getStatusCode > 400) {
        None
      } else {
        Some(graphUri)
      }
    }
    catch {
      case e: Throwable => throw e
    }
    finally {
      httpClient.getConnectionManager.shutdown()
    }
  }

  def pushToTripleStore(ttl: String, graphUri: String) = {
    val requestUri = String.format("%s/sparql-graph-crud-auth?graph-uri=%s", internalEndpointUrl.replace("/sparql",""), graphUri)
    val credentials = new UsernamePasswordCredentials("dba", "dba")
    val httpClient = new DefaultHttpClient()
    val post = new HttpPost(requestUri)
    post.addHeader("X-Requested-Auth", "Digest")
    try {
      httpClient.getCredentialsProvider.setCredentials(AuthScope.ANY, credentials)
      val stringEntity = new StringEntity(ttl, "UTF-8")
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

  def pushToTripleStore(model: Model, graphUri: String)(reporterProps: Props = null) : Boolean = {

    val reporter = Option(reporterProps).map(Akka.system.actorOf)

    val requestUri = String.format("%s/sparql-graph-crud-auth?graph-uri=%s", internalEndpointUrl.replace("/sparql",""), graphUri)

    reporter.foreach(r => r ! "pushing to "+requestUri + " ["+(model.size() + " statements")+"]")

    val stringData = Graph(model).toTTL

    val credentials = new UsernamePasswordCredentials("dba", "dba")
    val httpClient = new DefaultHttpClient()
    val post = new HttpPost(requestUri)
    post.addHeader("X-Requested-Auth", "Digest")
    try {

      httpClient.getCredentialsProvider.setCredentials(AuthScope.ANY, credentials)
      val stringEntity = new StringEntity(stringData, "UTF-8")
      post.setEntity(stringEntity)
      val response = httpClient.execute(post)
      reporter.foreach(r => r ! response.toString)

      if(response.getStatusLine.getStatusCode > 400) {
        val ss = new ByteArrayOutputStream()
        response.getEntity.writeTo(ss)
        reporter.foreach(r => r ! ss.toString("UTF-8"))
        false
      } else {
        true
      }
    }
    catch {
      case e: Throwable => throw e
    }
    finally {
      reporter.foreach(r => r  ! "no longer pushing to "+requestUri)
      httpClient.getConnectionManager.shutdown()
    }
  }

}
