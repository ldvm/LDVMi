package data.models

import play.api.db.slick.Config.driver.simple._

case class Visualization(id: Long, name: String, dataSourceId: Long, dsdDataSourceId: Long)

class Visualizations(tag: Tag) extends Table[Visualization](tag, "VISUALIZATIONS") {
  val dataSources = TableQuery[DataSources]

  def dataSource = foreignKey("VISUALIZATION_DATASOURCE_FK", dataSourceId, dataSources)(_.id)

  def dsdDataSource = foreignKey("VISUALIZATION_DSD_DATASOURCE_FK", dsdDataSourceId, dataSources)(_.id)

  def dsdDataSourceId = column[Long]("DSD_DATASOURCE_ID")

  def * = (id, name, dataSourceId, dsdDataSourceId) <>(Visualization.tupled, Visualization.unapply _)

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def dataSourceId = column[Long]("DATASOURCE_ID")
}

object Visualizations {

  val visualizations = TableQuery[Visualizations]
  val dataSources = TableQuery[DataSources]

  def findById(id: Long)(implicit s: Session): Option[Visualization] = {
    visualizations.filter(_.id === id).firstOption
  }

  def findByIdWithDataSource(id: Long)(implicit s: Session): Option[(Visualization, DataSource, DataSource)] = {
    (for {
      ((v, d), d2) <- visualizations.filter(_.id === id) innerJoin dataSources on (_.dataSourceId === _.id) innerJoin dataSources on (_._1.dsdDataSourceId === _.id)
    } yield (v, d, d2)).list().headOption
  }

}