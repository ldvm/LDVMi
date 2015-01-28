package model.entity

import java.util.UUID

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

case class AnalyzerTemplateId(id: Long) extends AnyVal with BaseId

object AnalyzerTemplateId extends IdCompanion[AnalyzerTemplateId]

case class AnalyzerTemplate(
  id: Option[AnalyzerTemplateId],
  componentTemplateId: ComponentTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[AnalyzerTemplateId] with SpecificComponentTemplate


class AnalyzerTemplateTable(tag: Tag) extends IdEntityTable[AnalyzerTemplateId, AnalyzerTemplate](tag, "analyzer_templates") {

  def componentTemplate = foreignKey("fk_at_ctt_component_template_id", componentId, componentTemplatesQuery)(_.id)

  def componentId = column[ComponentTemplateId]("component_template_id", O.NotNull)

  def * = (id.?, componentId, uuid, createdUtc, modifiedUtc) <>(AnalyzerTemplate.tupled, AnalyzerTemplate.unapply _)
}