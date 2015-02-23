package model.service.component

import akka.actor.Props
import com.hp.hpl.jena.rdf.model.Model
import model.rdf.Graph
import org.apache.http.auth.{AuthScope, UsernamePasswordCredentials}
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.StringEntity
import org.apache.http.impl.client.DefaultHttpClient
import org.apache.http.message.BasicHeader
import org.apache.http.protocol.HTTP
import play.api.libs.concurrent.Akka
import play.api.Play.current

import scala.concurrent.Future

trait AnalyzerPlugin {

  def run(inputs: Seq[DataReference], reporterProps: Props): Future[(String, Option[String])]

  protected def pushToTripleStore(model: Model, endpoint: String, graphUri: String)(reporterProps: Props) = {

    val reporter = Akka.system.actorOf(reporterProps)

    val requestUri = String.format("%s/sparql-graph-crud-auth?graph-uri=%s", endpoint.replace("/sparql",""), graphUri)

    reporter ! "pushing to "+requestUri

    val stringData = Graph(model).toRdfXml

    val credentials = new UsernamePasswordCredentials("dba", "dba")
    val httpClient = new DefaultHttpClient()
    val post = new HttpPost(requestUri)
    post.addHeader("X-Requested-Auth", "Digest")
    post.addHeader("Content-Type", "application/xml")
    try {

      httpClient.getCredentialsProvider.setCredentials(AuthScope.ANY, credentials)
      val stringEntity = new StringEntity(stringData, "UTF-8")
      stringEntity.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, "application/xml"))
      post.setEntity(stringEntity)
      httpClient.execute(post)
    }
    catch {
      case e: Throwable => throw e
    }
    finally {
      reporter ! "no longer pushing to "+requestUri
      httpClient.getConnectionManager.shutdown()
    }
  }

}
