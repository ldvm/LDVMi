package model.entity

import java.util.UUID

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

case class AnalyzerInstanceId(id: Long) extends AnyVal with BaseId

object AnalyzerInstanceId extends IdCompanion[AnalyzerInstanceId]

case class AnalyzerInstance(
  id: Option[AnalyzerInstanceId],
  componentInstanceId: ComponentInstanceId,
  analyzerId: AnalyzerTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[AnalyzerInstanceId] with SpecificComponentInstance


class AnalyzerInstanceTable(tag: Tag) extends IdEntityTable[AnalyzerInstanceId, AnalyzerInstance](tag, "analyzer_instances") {

  def analyzer = foreignKey(fkName("at_analyzer_id"), analyzerId, analyzerTemplatesQuery)(_.id)

  def * = (id.?, componentInstanceId, analyzerId, uuid, createdUtc, modifiedUtc) <>(AnalyzerInstance.tupled, AnalyzerInstance.unapply _)

  def analyzerId = column[AnalyzerTemplateId]("analyzer_id", O.NotNull)

  def componentInstance = foreignKey(fkName("cit_component_instance_id"), componentInstanceId, componentInstancesQuery)(_.id)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)
}