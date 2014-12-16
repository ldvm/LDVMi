package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class DataPortId(id: Long) extends AnyVal with BaseId

object DataPortId extends IdCompanion[DataPortId]

case class DataPort(
  id: Option[DataPortId],
  uri: String,
  title: String,
  description: Option[String],
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends UriIdentifiedEntity[DataPortId] {

  def component (implicit session: Session) : Component = {
    (for {
      c <- componentsQuery if c.id === componentId
    } yield c).first
  }
}


class DataPortTable(tag: Tag) extends UriIdentifiedEntityTable[DataPortId, DataPort](tag, "dataports") {

  def * = (id.?, uri, title, description, componentId, createdUtc, modifiedUtc) <>(DataPort.tupled, DataPort.unapply _)

  def componentId = column[ComponentId]("component_id", O.NotNull)
}