package model.dao

import org.joda.time.DateTime
import play.api.db.slick.Config.driver.simple._
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class VisualizerId(id: Long) extends AnyVal with BaseId
object VisualizerId extends IdCompanion[VisualizerId]

case class Visualizer(
  id: Option[VisualizerId],
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity


class VisualizerTable(tag: Tag) extends IdEntityTable[VisualizerId, Visualizer](tag, "visualizer") {

  val components = TableQuery[ComponentTable]

  def component = foreignKey("fk_vt_ct_component_id", componentId, components)(_.id)

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def * = (id, componentId, createdUtc, modifiedUtc) <> (Visualizer.tupled, Visualizer.unapply _)
}