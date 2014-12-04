package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class DataPortInstanceId(id: Long) extends AnyVal with BaseId

object DataPortInstanceId extends IdCompanion[DataPortInstanceId]

case class DataPortInstance(
  id: Option[DataPortInstanceId],
  componentInstanceId: ComponentInstanceId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[DataPortInstanceId]


class DataPortInstanceTable(tag: Tag) extends IdEntityTable[DataPortInstanceId, DataPortInstance](tag, "dataport_instances") {

  def * = (id.?, componentInstanceId, createdUtc, modifiedUtc) <> (DataPortInstance.tupled, DataPortInstance.unapply _)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)
}