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
  configuration: Option[String] = None,
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[ComponentInstanceId]

class ComponentInstanceTable(tag: Tag) extends IdEntityTable[ComponentInstanceId, ComponentInstance](tag, "component_instances") {

  def uri = column[String]("uri", O.NotNull)

  def * = (id.?, uri, configuration, componentId, createdUtc, modifiedUtc) <>(ComponentInstance.tupled, ComponentInstance.unapply _)

  def configuration = column[Option[String]]("configuration")

  def component = foreignKey("fk_cit_ct_component_id", componentId, componentsQuery)(_.id)

  def componentId = column[ComponentId]("component_id", O.NotNull)

}

trait ConcreteComponentInstance {
  def componentInstanceId: ComponentInstanceId

  def componentInstance(implicit session: Session): ComponentInstance = componentInstancesQuery.filter(_.id === componentInstanceId).first
}



