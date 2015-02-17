package model.entity

import java.util.UUID

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

import scala.slick.lifted.Tag

case class ComponentInstanceId(id: Long) extends AnyVal with BaseId

object ComponentInstanceId extends IdCompanion[ComponentInstanceId]

case class ComponentInstance(
  id: Option[ComponentInstanceId],
  uri: String,
  title: String,
  description: Option[String],
  componentId: ComponentTemplateId,
  configuration: Option[String] = None,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends UriIdentifiedEntity[ComponentInstanceId] {

  def stringDescription: String = id.map(_.toString) + "<" + uri + ">"

  def hasOutput(implicit session: Session): Boolean = componentTemplate.outputTemplate.nonEmpty
  def hasInput(implicit session: Session): Boolean = componentTemplate.inputTemplates.nonEmpty

  def inputInstances(implicit session: Session) : Seq[InputInstance] = {
    (for{
      ii <- inputInstancesQuery if ii.componentInstanceId === id
    } yield ii).list
  }

  def descriptorsAppliedTo(inputInstance: InputInstance)(implicit session: Session) : Seq[Descriptor] = {
    (for {
      ctf <- componentFeaturesQuery if ctf.componentTemplateId === componentId
      d <- descriptorsQuery if d.featureId === ctf.featureId && d.inputTemplateId === inputInstance.inputTemplateId
    } yield d).list
  }

  def componentTemplate(implicit session: Session) : ComponentTemplate = {
    (for {
      c <- componentTemplatesQuery if c.id === componentId
    } yield c).first
  }

  override def toString = uri

}

class ComponentInstanceTable(tag: Tag) extends UriIdentifiedEntityTable[ComponentInstanceId, ComponentInstance](tag, "component_instances") {

  def * = (id.?, uri, title, description, componentId, configuration, uuid, createdUtc, modifiedUtc) <>(ComponentInstance.tupled, ComponentInstance.unapply _)

  def configuration = column[Option[String]]("configuration")

  def component = foreignKey("fk_cit_ct_component_id", componentId, componentTemplatesQuery)(_.id)

  def componentId = column[ComponentTemplateId]("component_id", O.NotNull)

}

trait SpecificComponentInstance {
  def componentInstanceId: ComponentInstanceId

  def componentInstance(implicit session: Session): ComponentInstance = componentInstancesQuery.filter(_.id === componentInstanceId).first
}



