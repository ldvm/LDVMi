package model.dao

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class DataPortId(id: Long) extends AnyVal with BaseId
object DataPortId extends IdCompanion[DataPortId]

case class DataPort(
  id: Option[DataPortId],
  inputId: Option[InputId],
  outputId: Option[OutputId],
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity {

  def isInput = inputId.isDefined

  def isOutput = outputId.isDefined

}


class DataPortTable(tag: Tag) extends DescribedEntityTable[DataPortId, DataPort](tag, "dataports") {

  def inputId = column[Option[InputId]]("input_id")

  def outputId = column[Option[OutputId]]("output_id")

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def * = (id, inputId, outputId, componentId, createdUtc, modifiedUtc) <> (DataPort.tupled, DataPort.unapply _)
}