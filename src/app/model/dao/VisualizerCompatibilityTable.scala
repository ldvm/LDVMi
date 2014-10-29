package model.dao

import model.services.EagerBox
import org.joda.time.DateTime
import play.api.db.slick.Config.driver.simple._
import PortableJodaSupport._

case class VisualizerCompatibility(
  id: Long,
  visualizerId: Long,
  dataSourceId: Option[Long],
  visualizationId: Option[Long],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdentifiedEntity

case class VisualizerCompatibilityEagerBox(visualizerCompatibility: VisualizerCompatibility, visualizer: Visualizer) extends EagerBox[VisualizerCompatibility]{
  override def mainEntity: VisualizerCompatibility = visualizerCompatibility
}

class VisualizerCompatibilityTable(tag: Tag) extends Table[VisualizerCompatibility](tag, "VISUALIZERS_COMPATIBILITY") with IdentifiedEntityTable[VisualizerCompatibility] {
  val dataSources = TableQuery[DataSourcesTable]
  val visualizations = TableQuery[VisualizationTable]
  val visualizers = TableQuery[VisualizerTable]

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def visualization = foreignKey("VC_VISUALIZATION_FK", visualizationId, visualizations)(_.id)

  def visualizer = foreignKey("VC_VISUALIZER_FK", visualizerId, visualizers)(_.id)

  def dataSource = foreignKey("VC_DATA_SOURCE_FK", dataSourceId, dataSources)(_.id)

  def createdUtc = column[Option[DateTime]]("CREATED")

  def modifiedUtc = column[Option[DateTime]]("MODIFIED")

  def dataSourceId = column[Option[Long]]("DATASOURCE_ID")

  def visualizationId = column[Option[Long]]("VISUALIZATION_ID")

  def visualizerId = column[Long]("VISUALIZER_ID")

  def * = (id, visualizerId, dataSourceId, visualizationId, createdUtc, modifiedUtc) <>(VisualizerCompatibility.tupled, VisualizerCompatibility.unapply _)

}



