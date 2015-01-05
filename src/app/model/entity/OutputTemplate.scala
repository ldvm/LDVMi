package model.entity

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class OutputId(id: Long) extends AnyVal with BaseId
object OutputId extends IdCompanion[OutputId]

case class OutputTemplate(
  id: Option[OutputId],
  dataSample: Option[String],
  dataPortTemplateId: DataPortTemplateId,
  componentTemplateId: ComponentTemplateId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[OutputId]

class OutputTemplateTable(tag: Tag) extends IdEntityTable[OutputId, OutputTemplate](tag, "output_templates") {

  def dataPortTemplateId = column[DataPortTemplateId]("dataport_template_id", O.NotNull)

  def componentTemplateId = column[ComponentTemplateId]("component_template_id", O.NotNull)

  def dataSample = column[Option[String]]("output_data_sample")

  def * = (id.?, dataSample, dataPortTemplateId, componentTemplateId, createdUtc, modifiedUtc) <> (OutputTemplate.tupled, OutputTemplate.unapply _)
}