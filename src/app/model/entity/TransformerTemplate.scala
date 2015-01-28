package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class TransformerTemplateId(id: Long) extends AnyVal with BaseId
object TransformerTemplateId extends IdCompanion[TransformerTemplateId]

case class TransformerTemplate(
  id: Option[TransformerTemplateId],
  componentTemplateId: ComponentTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[TransformerTemplateId] with SpecificComponentTemplate


class TransformerTemplateTable(tag: Tag) extends IdEntityTable[TransformerTemplateId, TransformerTemplate](tag, "transformer_templates") {

  def componentTemplate = foreignKey("fk_tt_ctt_component_template_id", componentTemplateId, componentTemplatesQuery)(_.id)

  def componentTemplateId = column[ComponentTemplateId]("component_template_id", O.NotNull)

  def * = (id.?, componentTemplateId, uuid, createdUtc, modifiedUtc) <> (TransformerTemplate.tupled, TransformerTemplate.unapply _)
}