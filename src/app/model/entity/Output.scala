package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class OutputId(id: Long) extends AnyVal with BaseId
object OutputId extends IdCompanion[OutputId]

case class Output(
  id: Option[OutputId],
  dataSample: Option[String],
  dataPortId: DataPortId,
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[OutputId]


class OutputTable(tag: Tag) extends IdEntityTable[OutputId, Output](tag, "outputs") {

  def dataPortId = column[DataPortId]("dataport_id", O.NotNull)

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def dataSample = column[Option[String]]("output_data_sample")

  def * = (id.?, dataSample, dataPortId, componentId, createdUtc, modifiedUtc) <> (Output.tupled, Output.unapply _)
}