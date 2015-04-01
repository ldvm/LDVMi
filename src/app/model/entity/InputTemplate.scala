package model.entity

import java.util.UUID

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

case class InputTemplateId(id: Long) extends AnyVal with BaseId

object InputTemplateId extends IdCompanion[InputTemplateId]

case class InputTemplate(
  id: Option[InputTemplateId],
  dataPortTemplateId: DataPortTemplateId,
  componentTemplateId: ComponentTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[InputTemplateId] {

  def descriptors(onlyMandatory: Boolean = false)(implicit session: Session): Seq[Descriptor] = {
    if (onlyMandatory) {
      (for {
        d <- descriptorsQuery if d.inputTemplateId === id
        f <- featuresQuery if d.featureId === f.id && f.isMandatory === true
      } yield d).list
    } else {
      (for {
        d <- descriptorsQuery if d.inputTemplateId === id
      } yield d).list
    }
  }

  def dataPortTemplate(implicit session: Session): DataPortTemplate = {
    (for {
      d <- dataPortTemplatesQuery if d.id === dataPortTemplateId
    } yield d).first
  }

}


class InputTemplateTable(tag: Tag) extends IdEntityTable[InputTemplateId, InputTemplate](tag, "input_templates") {

  def * = (id.?, dataPortTemplateId, componentTemplateId, uuid, createdUtc, modifiedUtc) <>(InputTemplate.tupled, InputTemplate.unapply _)

  def dataPortTemplateId = column[DataPortTemplateId]("dataport_template_id", O.NotNull)

  def componentTemplateId = column[ComponentTemplateId]("component_id", O.NotNull)
}