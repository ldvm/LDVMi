package model.entity

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class OutputInstanceId(id: Long) extends AnyVal with BaseId
object OutputInstanceId extends IdCompanion[OutputInstanceId]

case class OutputInstance(
  id: Option[OutputInstanceId],
  dataPortInstanceId: DataPortInstanceId,
  componentInstanceId: ComponentInstanceId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[OutputInstanceId]


class OutputInstanceTable(tag: Tag) extends IdEntityTable[OutputInstanceId, OutputInstance](tag, "output_instances") {

  def * = (id.?, dataPortInstanceId, componentInstanceId, createdUtc, modifiedUtc) <> (OutputInstance.tupled, OutputInstance.unapply _)

  def dataPortInstanceId = column[DataPortInstanceId]("dataport_instance_id", O.NotNull)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)
}