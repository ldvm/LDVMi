package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class InputInstanceId(id: Long) extends AnyVal with BaseId
object InputInstanceId extends IdCompanion[InputInstanceId]

case class InputInstance(
  id: Option[InputInstanceId],
  dataPortInstanceId: DataPortInstanceId,
  componentInstanceId: ComponentInstanceId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[InputInstanceId]


class InputInstanceTable(tag: Tag) extends IdEntityTable[InputInstanceId, InputInstance](tag, "input_instances") {

  def dataPortInstanceId = column[DataPortInstanceId]("dataport_instance_id", O.NotNull)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)

  def * = (id.?, dataPortInstanceId, componentInstanceId, createdUtc, modifiedUtc) <> (InputInstance.tupled, InputInstance.unapply _)
}