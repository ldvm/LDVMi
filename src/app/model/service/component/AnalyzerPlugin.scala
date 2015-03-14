package model.service.component

import java.io.{ByteArrayOutputStream, StringReader, StringWriter}

import akka.actor.Props
import com.hp.hpl.jena.rdf.model.Model
import model.entity.ComponentInstance
import model.rdf.Graph
import model.service.SessionScoped
import org.apache.http.auth.{AuthScope, UsernamePasswordCredentials}
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.StringEntity
import org.apache.http.impl.client.DefaultHttpClient
import org.apache.http.message.BasicHeader
import org.apache.http.protocol.HTTP
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka
import play.api.Play.current

import scala.concurrent.Future

trait AnalyzerPlugin extends SessionScoped {

  def componentInstance: ComponentInstance

  def dataReferencesByPortTemplateUri(dataReferences: Seq[DataReference]): Map[String, Option[DataReference]] = {
    withSession { implicit session =>
      val inputTemplates = componentInstance.componentTemplate.inputTemplates
      val inputTemplateUris = inputTemplates.map(_.dataPortTemplate.uri)

      val inputInstanceUrisByTemplateUri : Map[String, Option[String]] = {
        inputTemplateUris.map { u =>
          (u, componentInstance.inputInstances.collectFirst{ case ii if ii.dataPortInstance.dataPortTemplate.uri == u => ii.dataPortInstance.uri })
        }.toMap
      }

      inputTemplateUris.map { iu =>
        val ref = inputInstanceUrisByTemplateUri.get(iu).flatten.map { u =>
          dataReferences.find(_.portUri == u)
        }.flatten
        (iu, ref)
      }.toMap
    }
  }

  def run(inputs: Seq[DataReference], reporterProps: Props): Future[(String, Option[String])]

  protected def pushToTripleStore(model: Model, endpoint: String, graphUri: String)(reporterProps: Props) : Boolean = {

    val reporter = Akka.system.actorOf(reporterProps)

    val requestUri = String.format("%s/sparql-graph-crud-auth?graph-uri=%s", endpoint.replace("/sparql",""), graphUri)

    reporter ! "pushing to "+requestUri + " ["+(model.size() + " statements")+"]"

    val stringData = Graph(model).toTTL

    val credentials = new UsernamePasswordCredentials("dba", "dba")
    val httpClient = new DefaultHttpClient()
    val post = new HttpPost(requestUri)
    post.addHeader("X-Requested-Auth", "Digest")
    //post.addHeader("Content-Type", "application/xml")
    try {

      httpClient.getCredentialsProvider.setCredentials(AuthScope.ANY, credentials)
      val stringEntity = new StringEntity(stringData, "UTF-8")
      //stringEntity.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, "application/xml"))
      post.setEntity(stringEntity)
      val response = httpClient.execute(post)
      reporter ! response.toString

      if(response.getStatusLine.getStatusCode > 400) {
        val ss = new ByteArrayOutputStream()
        response.getEntity.writeTo(ss)
        reporter ! ss.toString("UTF-8")
        false
      } else {
        true
      }
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
