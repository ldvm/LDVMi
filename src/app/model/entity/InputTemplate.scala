package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class InputTemplateId(id: Long) extends AnyVal with BaseId
object InputTemplateId extends IdCompanion[InputTemplateId]

case class InputTemplate(
  id: Option[InputTemplateId],
  dataPortTemplateId: DataPortTemplateId,
  componentTemplateId: ComponentTemplateId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[InputTemplateId] {
  
  def dataPortTemplate(implicit session: Session) : DataPortTemplate = {
    (for {
      d <- dataPortTemplatesQuery if d.id === dataPortTemplateId
    } yield d).first
  }
  
}


class InputTemplateTable(tag: Tag) extends IdEntityTable[InputTemplateId, InputTemplate](tag, "input_templates") {

  def dataPortTemplateId = column[DataPortTemplateId]("dataport_template_id", O.NotNull)

  def componentTemplateId = column[ComponentTemplateId]("component_id", O.NotNull)

  def * = (id.?, dataPortTemplateId, componentTemplateId, createdUtc, modifiedUtc) <> (InputTemplate.tupled, InputTemplate.unapply _)
}