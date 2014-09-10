package data.models

import play.api.db.slick.Config.driver.simple._
import services.data.EagerBox

case class Visualization(id: Long, name: String, dataSourceId: Long, dsdDataSourceId: Long)
case class VisualizationEagerBox(visualization: Visualization, dataSource: DataSource, dsdDataSource: DataSource) extends EagerBox[Visualization]

class VisualizationTable(tag: Tag) extends Table[Visualization](tag, "VISUALIZATIONS") with IdentifiedEntityTable[Visualization]  {
  val dataSources = TableQuery[DataSourcesTable]

  def dataSource = foreignKey("VISUALIZATION_DATASOURCE_FK", dataSourceId, dataSources)(_.id)

  def dsdDataSource = foreignKey("VISUALIZATION_DSD_DATASOURCE_FK", dsdDataSourceId, dataSources)(_.id)

  def dsdDataSourceId = column[Long]("DSD_DATASOURCE_ID")

  def * = (id, name, dataSourceId, dsdDataSourceId) <>(Visualization.tupled, Visualization.unapply _)

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def dataSourceId = column[Long]("DATASOURCE_ID")
}