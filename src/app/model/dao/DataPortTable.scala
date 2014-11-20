package model.dao

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class DataPortId(id: Long) extends AnyVal with BaseId
object DataPortId extends IdCompanion[DataPortId]

case class DataPort(
  id: Option[DataPortId],

  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity


class DataPortTable(tag: Tag) extends IdEntityTable[DataPortId, DataPort](tag, "dataports") {

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def * = (id, componentId, createdUtc, modifiedUtc) <> (DataPort.tupled, DataPort.unapply _)
}