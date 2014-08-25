package data.models

import play.api.db.slick.Config.driver.simple._

case class VisualizationRow(id: Long, name: String, dataSourceId: Long, dsdDataSourceId: Long)

class VisualizationsTable(tag: Tag) extends Table[VisualizationRow](tag, "VISUALIZATIONS") {
  val dataSources = TableQuery[DataSourcesTable]

  def dataSource = foreignKey("VISUALIZATION_DATASOURCE_FK", dataSourceId, dataSources)(_.id)

  def dsdDataSource = foreignKey("VISUALIZATION_DSD_DATASOURCE_FK", dsdDataSourceId, dataSources)(_.id)

  def dsdDataSourceId = column[Long]("DSD_DATASOURCE_ID")

  def * = (id, name, dataSourceId, dsdDataSourceId) <>(VisualizationRow.tupled, VisualizationRow.unapply _)

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def dataSourceId = column[Long]("DATASOURCE_ID")
}

object VisualizationsTable {

  val visualizations = TableQuery[VisualizationsTable]
  val dataSources = TableQuery[DataSourcesTable]

  def findById(id: Long)(implicit s: Session): Option[VisualizationRow] = {
    visualizations.filter(_.id === id).firstOption
  }

  def findByIdWithDataSources(id: Long)(implicit s: Session): Option[(VisualizationRow, DataSourceRow, DataSourceRow)] = {
    (for {
      ((v, d), d2) <- visualizations.filter(_.id === id).take(1) innerJoin dataSources on (_.dataSourceId === _.id) leftJoin dataSources on (_._1.dsdDataSourceId === _.id)
    } yield (v, d, d2)).list().headOption
  }

  def listWithDataSources(skip: Int = 0, take: Int = 10)(implicit s: Session): Seq[(VisualizationRow, DataSourceRow, DataSourceRow)] = {
    (for {
      ((v, d), d2) <- visualizations.sortBy(_.name).drop(skip).take(take) leftJoin dataSources on (_.dataSourceId === _.id) leftJoin dataSources on (_._1.dsdDataSourceId === _.id)
    } yield (v, d, d2)).list()
  }

}