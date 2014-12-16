package model.entity

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
  componentId: ComponentId,
  configuration: Option[String] = None,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends UriIdentifiedEntity[ComponentInstanceId] {

  def descriptorsAppliedTo(inputInstance: InputInstance)(implicit session: Session) : Seq[Descriptor] = {
    (for {
      ctf <- componentFeaturesQuery if ctf.componentId === componentId
      d <- descriptorsQuery if d.featureId === ctf.featureId && d.inputId === inputInstance.inputId
    } yield d).list
  }

  def component(implicit session: Session) : Component = {
    (for {
      c <- componentsQuery if c.id === componentId
    } yield c).first
  }

}

class ComponentInstanceTable(tag: Tag) extends UriIdentifiedEntityTable[ComponentInstanceId, ComponentInstance](tag, "component_instances") {

  def * = (id.?, uri, title, description, componentId, configuration, createdUtc, modifiedUtc) <>(ComponentInstance.tupled, ComponentInstance.unapply _)

  def configuration = column[Option[String]]("configuration")

  def component = foreignKey("fk_cit_ct_component_id", componentId, componentsQuery)(_.id)

  def componentId = column[ComponentId]("component_id", O.NotNull)

}

trait ConcreteComponentInstance {
  def componentInstanceId: ComponentInstanceId

  def componentInstance(implicit session: Session): ComponentInstance = componentInstancesQuery.filter(_.id === componentInstanceId).first
}



