package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class InputId(id: Long) extends AnyVal with BaseId
object InputId extends IdCompanion[InputId]

case class Input(
  id: Option[InputId],
  dataPortId: DataPortId,
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[InputId]


class InputTable(tag: Tag) extends IdEntityTable[InputId, Input](tag, "inputs") {

  def dataPortId = column[DataPortId]("dataport_id", O.NotNull)

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def * = (id.?, dataPortId, componentId, createdUtc, modifiedUtc) <> (Input.tupled, Input.unapply _)
}