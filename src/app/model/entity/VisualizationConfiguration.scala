package model.entity

import java.util.UUID

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime


case class VisualizationConfigurationId(id: Long) extends AnyVal with BaseId

object VisualizationConfigurationId extends IdCompanion[VisualizationConfigurationId]

case class VisualizationConfiguration(
  id: Option[VisualizationConfigurationId],
  visualizerUri: String,
  visualizationUri: String,
  priority: Int,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[VisualizationConfigurationId]

class VisualizationConfigurationTable(tag: Tag) extends IdEntityTable[VisualizationConfigurationId, VisualizationConfiguration](tag, "visualization_configuration") {

  def visualizerTemplate = foreignKey("fk_vc_ct_uri", visualizerUri, componentTemplatesQuery)(_.uri)

  def visualizerUri = column[String]("visualizer_uri", O.NotNull)

  def visualizationUri = column[String]("visualization_uri", O.NotNull)

  def priority = column[Int]("visualization_priority", O.NotNull)

  def * = (id.?, visualizerUri, visualizationUri, priority, uuid, createdUtc, modifiedUtc) <>(VisualizationConfiguration.tupled, VisualizationConfiguration.unapply)

}