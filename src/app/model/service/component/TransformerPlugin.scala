package model.service.component

import akka.actor.Props
import model.entity.ComponentInstance
import model.service.SessionScoped

import scala.concurrent.Future

trait TransformerPlugin extends SessionScoped {

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
