package model.entity

import java.io.StringWriter

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime
import play.api.db.slick.Session

import scala.slick.lifted.Tag

case class ComponentId(id: Long) extends AnyVal with BaseId

object ComponentId extends IdCompanion[ComponentId]

case class Component(
  id: Option[ComponentId],
  uri: String,
  title: String,
  description: Option[String],
  defaultConfiguration: Option[String] = None,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends UriIdentifiedEntity[ComponentId] {

  def features(implicit s: Session): Seq[Feature] = (for {
    cf <- componentFeaturesQuery if cf.componentId === id
    f <- featuresQuery if cf.featureId === f.id
  } yield f).list

  def inputs(implicit s: Session): Seq[Input] = (for {
    i <- inputsQuery if i.componentId === id
  } yield i).list

  def output(implicit s: Session): Option[Output] = (for {
    o <- outputsQuery if o.componentId === id
  } yield o).firstOption

  def configuration = ComponentConfiguration(defaultConfiguration)
}

object ComponentEntity {
  def apply(component: model.dto.Component): Component = {

    val configString = component.configuration.map{ config =>
      val configWriter = new StringWriter
      config.write(configWriter, "N3")
      configWriter.toString
    }

    Component(
      None,
      component.uri,
      component.label.getOrElse("Unlabeled component"),
      component.comment,
      configString
    )
  }
}

class ComponentTable(tag: Tag) extends UriIdentifiedEntityTable[ComponentId, Component](tag, "components") {

  def defaultConfiguration = column[Option[String]]("default_configuration")

  def * = (id.?, uri, title, description, defaultConfiguration, createdUtc, modifiedUtc) <>(Component.tupled, Component.unapply _)

}

trait ConcreteComponent {
  def componentId: ComponentId

  def component(implicit session: Session): Component = componentsQuery.filter(_.id === componentId).first
}



