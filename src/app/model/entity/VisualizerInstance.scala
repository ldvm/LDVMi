package model.entity

import java.util.UUID

import model.repository.EagerBox
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class VisualizerInstanceId(id: Long) extends AnyVal with BaseId
object VisualizerInstanceId extends IdCompanion[VisualizerInstanceId]

case class VisualizerInstanceEagerBox(visualizer: VisualizerInstance, component: ComponentTemplate) extends EagerBox[VisualizerInstance](visualizer)

case class VisualizerInstance(
  id: Option[VisualizerInstanceId],
  componentInstanceId: ComponentInstanceId,
  visualizerId: VisualizerTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[VisualizerInstanceId]


class VisualizerInstanceTable(tag: Tag) extends IdEntityTable[VisualizerInstanceId, VisualizerInstance](tag, "visualizer_instances") {

  def visualizer = foreignKey("fk_vit_dst_visualizer_id", visualizerTemplateId, visualizerTemplatesQuery)(_.id)

  def visualizerTemplateId = column[VisualizerTemplateId]("visualizer_id", O.NotNull)

  def * = (id.?, componentInstanceId, visualizerTemplateId, uuid, createdUtc, modifiedUtc) <> (VisualizerInstance.tupled, VisualizerInstance.unapply _)

  def componentInstance = foreignKey("fk_vit_cit_component_instance_id", componentInstanceId, componentInstancesQuery)(_.id)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)
}