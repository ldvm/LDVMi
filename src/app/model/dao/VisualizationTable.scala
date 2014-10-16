package model.dao

import model.dao.PortableJodaSupport._
import model.services.EagerBox
import org.joda.time.DateTime
import play.api.db.slick.Config.driver.simple._

case class Visualization(id: Long, name: String, dataSourceId: Long, dsdDataSourceId: Long, var createdUtc: Option[DateTime] = None, var modifiedUtc: Option[DateTime] = None) extends IdentifiedEntity

case class VisualizationEagerBox(visualization: Visualization, dataSource: DataSource, dsdDataSource: DataSource, token: Option[String]) extends EagerBox[Visualization] {
  override def mainEntity: Visualization = visualization
}

class VisualizationTable(tag: Tag) extends Table[Visualization](tag, "VISUALIZATIONS") with IdentifiedEntityTable[Visualization] {
  val dataSources = TableQuery[DataSourcesTable]

  def dataSource = foreignKey("VISUALIZATION_DATASOURCE_FK", dataSourceId, dataSources)(_.id)

  def dsdDataSource = foreignKey("VISUALIZATION_DSD_DATASOURCE_FK", dsdDataSourceId, dataSources)(_.id)

  def dsdDataSourceId = column[Long]("DSD_DATASOURCE_ID")

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def createdUtc = column[Option[DateTime]]("created")

  def modifiedUtc = column[Option[DateTime]]("modified")

  def dataSourceId = column[Long]("DATASOURCE_ID")

  def * = (id, name, dataSourceId, dsdDataSourceId, createdUtc, modifiedUtc) <>(Visualization.tupled, Visualization.unapply _)

}