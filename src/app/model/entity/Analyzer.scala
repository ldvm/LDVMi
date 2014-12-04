package model.entity

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

case class AnalyzerId(id: Long) extends AnyVal with BaseId

object AnalyzerId extends IdCompanion[AnalyzerId]

case class Analyzer(
  id: Option[AnalyzerId],
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[AnalyzerId] with ConcreteComponent


class AnalyzerTable(tag: Tag) extends IdEntityTable[AnalyzerId, Analyzer](tag, "analyzers") {

  def component = foreignKey("fk_at_ct_component_id", componentId, componentsQuery)(_.id)

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def * = (id.?, componentId, createdUtc, modifiedUtc) <>(Analyzer.tupled, Analyzer.unapply _)
}