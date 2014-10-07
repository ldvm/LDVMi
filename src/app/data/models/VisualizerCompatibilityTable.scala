package data.models

import org.joda.time.DateTime
import play.api.db.slick.Config.driver.simple._
import data.models.PortableJodaSupport._

case class VisualizerCompatibility(id: Long, dataSourceId: Long, visualizationId: Long, var createdUtc: Option[DateTime] = None, var modifiedUtc: Option[DateTime] = None) extends IdentifiedEntity

class VisualizerCompatibilityTable(tag: Tag) extends Table[VisualizerCompatibility](tag, "VISUALIZERS_COMPATIBILITY") with IdentifiedEntityTable[VisualizerCompatibility] {
  val dataSources = TableQuery[DataSourcesTable]
  val visualizations = TableQuery[VisualizationTable]

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def visualization = foreignKey("VC_VISUALIZER_FK", visualizationId, visualizations)(_.id)

  def dataSource = foreignKey("VC_DATA_SOURCE_FK", dataSourceId, dataSources)(_.id)

  def createdUtc = column[Option[DateTime]]("CREATED")

  def modifiedUtc = column[Option[DateTime]]("MODIFIED")

  def dataSourceId = column[Long]("DATASOURCE_ID")

  def visualizationId = column[Long]("VISUALIZATION_ID")

  def * = (id, visualizationId, dataSourceId, createdUtc, modifiedUtc) <>(VisualizerCompatibility.tupled, VisualizerCompatibility.unapply _)

}



