package model.entity

import java.io.StringWriter
import java.util.UUID

import model.entity.ComponentType.ComponentType
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
  description: Option[String] = None,
  nestedBindingSetId: Option[DataPortBindingSetId] = None,
  isTemporary: Boolean = false,
  defaultConfiguration: Option[String] = None,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends UriIdentifiedEntity[ComponentTemplateId] {

  def features(implicit s: Session): Seq[Feature] = (for {
    cf <- componentFeaturesQuery if cf.componentTemplateId === id
    f <- featuresQuery if cf.featureId === f.id
  } yield f).list

  def inputTemplates(implicit s: Session): Seq[InputTemplate] = (for {
    i <- inputTemplatesQuery if i.componentTemplateId === id
  } yield i).list

  def outputTemplate(implicit s: Session): Option[OutputTemplate] = (for {
    o <- outputTemplatesQuery if o.componentTemplateId === id
  } yield o).firstOption

  def nestedBindingSet(implicit s: Session): Option[DataPortBindingSet] = (for {
    bs <- bindingSetsQuery if bs.id === nestedBindingSetId
  } yield bs).firstOption

  def getType(implicit session: Session): ComponentType = {

    lazy val isDataSource = (for {
      q <- dataSourceTemplatesQuery if q.componentTemplateId === id
    } yield q).firstOption.isDefined

    lazy val isVisualizer = (for {
      q <- visualizerTemplatesQuery if q.componentTemplateId === id
    } yield q).firstOption.isDefined

    lazy val isAnalyzer = (for {
      q <- analyzerTemplatesQuery if q.componentTemplateId === id
    } yield q).firstOption.isDefined

    lazy val isTransformer = (for {
      q <- transformerTemplatesQuery if q.componentTemplateId === id
    } yield q).firstOption.isDefined

    Seq(
      (isDataSource, ComponentType.DataSource),
      (isVisualizer, ComponentType.Visualizer),
      (isAnalyzer, ComponentType.Analyzer),
      (isTransformer, ComponentType.Transformer)
    ).collectFirst{ case (is, cType) if is => cType }.get

  }
}

object ComponentEntity {
  def apply(template: model.dto.ComponentTemplate, nestedBindingSetId: Option[DataPortBindingSetId]): ComponentTemplate = {

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
      nestedBindingSetId,
      template.isTemporary,
      configString
    )
  }
}

class ComponentTemplateTable(tag: Tag) extends UriIdentifiedEntityTable[ComponentTemplateId, ComponentTemplate](tag, "component_templates") {

  def isTemporary = column[Boolean]("is_temporary")

  def defaultConfiguration = column[Option[String]]("default_configuration")

  def nestedBindingSetId = column[Option[DataPortBindingSetId]]("data_port_binding_set_id")

  def * = (id.?, uri, title, description, nestedBindingSetId, isTemporary, defaultConfiguration, uuid, createdUtc, modifiedUtc) <>(ComponentTemplate.tupled, ComponentTemplate.unapply _)

}

trait SpecificComponentTemplate {

  def id: Option[BaseId]

  def componentTemplateId: ComponentTemplateId

  def componentTemplate(implicit session: Session): ComponentTemplate = componentTemplatesQuery.filter(_.id === componentTemplateId).first

  def componentType: ComponentType
}

object ComponentType extends Enumeration {
  type ComponentType = Value
  val DataSource, Analyzer, Transformer, Visualizer = Value
}



