package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class VisualizerTemplateId(id: Long) extends AnyVal with BaseId
object VisualizerTemplateId extends IdCompanion[VisualizerTemplateId]

case class VisualizerTemplate(
  id: Option[VisualizerTemplateId],
  componentTemplateId: ComponentTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[VisualizerTemplateId] with SpecificComponentTemplate {
  def componentType = ComponentType.Visualizer
}


class VisualizerTemplateTable(tag: Tag) extends IdEntityTable[VisualizerTemplateId, VisualizerTemplate](tag, "visualizer_templates") {

  def componentTemplate = foreignKey("fk_vt_ctt_component_template_id", componentTemplateId, componentTemplatesQuery)(_.id)

  def componentTemplateId = column[ComponentTemplateId]("component_id", O.NotNull)

  def * = (id.?, componentTemplateId, uuid, createdUtc, modifiedUtc) <> (VisualizerTemplate.tupled, VisualizerTemplate.unapply _)
}