package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class DataPortId(id: Long) extends AnyVal with BaseId

object DataPortId extends IdCompanion[DataPortId]

case class DataPort(
  id: Option[DataPortId],
  componentId: ComponentId,
  title: String,
  description: Option[String],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends DescribedEntity[DataPortId]


class DataPortTable(tag: Tag) extends DescribedEntityTable[DataPortId, DataPort](tag, "dataports") {

  def * = (id.?, componentId, title, description, createdUtc, modifiedUtc) <>(DataPort.tupled, DataPort.unapply _)

  def componentId = column[ComponentId]("component_id", O.NotNull)
}