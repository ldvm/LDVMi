package model.entity

import java.util.UUID

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

case class OutputTemplateId(id: Long) extends AnyVal with BaseId

object OutputTemplateId extends IdCompanion[OutputTemplateId]

case class OutputTemplate(
  id: Option[OutputTemplateId],
  dataSample: Option[String],
  dataPortTemplateId: DataPortTemplateId,
  componentTemplateId: ComponentTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[OutputTemplateId] {

  def dataPortTemplate(implicit session: Session): DataPortTemplate = {
    (for {
      t <- dataPortTemplatesQuery if t.id === dataPortTemplateId
    } yield t).first
  }

}

class OutputTemplateTable(tag: Tag) extends IdEntityTable[OutputTemplateId, OutputTemplate](tag, "output_templates") {

  def * = (id.?, dataSample, dataPortTemplateId, componentTemplateId, uuid, createdUtc, modifiedUtc) <>(OutputTemplate.tupled, OutputTemplate.unapply _)

  def dataPortTemplateId = column[DataPortTemplateId]("dataport_template_id", O.NotNull)

  def componentTemplateId = column[ComponentTemplateId]("component_template_id", O.NotNull)

  def dataSample = column[Option[String]]("output_data_sample")
}