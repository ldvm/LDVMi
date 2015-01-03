package model.entity

import java.io.StringWriter

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime
import play.api.db.slick.Session

import scala.slick.lifted.Tag

case class ComponentTemplateId(id: Long) extends AnyVal with BaseId

object ComponentTemplateId extends IdCompanion[ComponentTemplateId]

case class ComponentTemplate(
  id: Option[ComponentTemplateId],
  uri: String,
  title: String,
  description: Option[String],
  defaultConfiguration: Option[String] = None,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends UriIdentifiedEntity[ComponentTemplateId] {

  def features(implicit s: Session): Seq[Feature] = (for {
    cf <- componentFeaturesQuery if cf.componentTemplateId === id
    f <- featuresQuery if cf.featureId === f.id
  } yield f).list

  def inputs(implicit s: Session): Seq[InputTemplate] = (for {
    i <- inputTemplatesQuery if i.componentTemplateId === id
  } yield i).list

  def output(implicit s: Session): Option[Output] = (for {
    o <- outputTemplatesQuery if o.componentTemplateId === id
  } yield o).firstOption
}

object ComponentEntity {
  def apply(template: model.dto.ComponentTemplate): ComponentTemplate = {

    val configString = template.configuration.map { config =>
      val configWriter = new StringWriter
      config.write(configWriter, "N3")
      configWriter.toString
    }

    ComponentTemplate(
      None,
      template.uri,
      template.label.getOrElse("Unlabeled component"),
      template.comment,
      configString
    )
  }
}

class ComponentTemplateTable(tag: Tag) extends UriIdentifiedEntityTable[ComponentTemplateId, ComponentTemplate](tag, "component_templates") {

  def defaultConfiguration = column[Option[String]]("default_configuration")

  def * = (id.?, uri, title, description, defaultConfiguration, createdUtc, modifiedUtc) <>(ComponentTemplate.tupled, ComponentTemplate.unapply _)

}

trait SpecificComponentTemplate {
  def componentTemplateId: ComponentTemplateId

  def componentTemplate(implicit session: Session): ComponentTemplate = componentTemplatesQuery.filter(_.id === componentTemplateId).first
}

object ComponentType extends Enumeration {
  type ComponentType = Value
  val DataSource, Analyzer, Transformer, Visualizer = Value
}



