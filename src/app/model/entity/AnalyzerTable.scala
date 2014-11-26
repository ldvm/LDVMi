package model.entity

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class AnalyzerId(id: Long) extends AnyVal with BaseId

object AnalyzerId extends IdCompanion[AnalyzerId]

case class Analyzer(
  id: Option[AnalyzerId],
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[AnalyzerId]


class AnalyzerTable(tag: Tag) extends IdEntityTable[AnalyzerId, Analyzer](tag, "analyzers") {

  val components = TableQuery[ComponentTable]

  def component = foreignKey("fk_at_ct_component_id", componentId, components)(_.id)

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def * = (id.?, componentId, createdUtc, modifiedUtc) <>(Analyzer.tupled, Analyzer.unapply _)
}