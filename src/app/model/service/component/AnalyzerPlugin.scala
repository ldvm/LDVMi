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

  def run(inputs: Seq[DataReference], reporterProps: Props): Future[(String, Seq[String])]

}
