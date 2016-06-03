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
  visualizationUri: String = "",
  priority: Int = 0,
  appgenName: String = "",
  appgenIcon: String = "",
  appgenDisabled: Boolean = true,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[VisualizationConfigurationId]

class VisualizationConfigurationTable(tag: Tag) extends IdEntityTable[VisualizationConfigurationId, VisualizationConfiguration](tag, "visualization_configuration") {

  def visualizerUri = column[String]("visualizer_uri", O.NotNull)

  def visualizationUri = column[String]("visualization_uri", O.NotNull)

  def priority = column[Int]("visualization_priority", O.NotNull)

  def appgenName = column[String]("appgen_name", O.NotNull)

  def appgenIcon = column[String]("appgen_icon", O.NotNull)

  def appgenDisabled = column[Boolean]("appgen_disabled", O.Default(false))

  def idx = index("idx_unique_visualizer_uri", visualizerUri, unique = true)

  def * = (id.?, visualizerUri, visualizationUri, priority, appgenName, appgenIcon, appgenDisabled, uuid, createdUtc, modifiedUtc) <> (VisualizationConfiguration.tupled, VisualizationConfiguration.unapply)
}