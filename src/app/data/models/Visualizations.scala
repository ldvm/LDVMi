package data.models

import data.models.DataSource
import play.api.db.slick.Config.driver.simple._

case class Visualization(id: Long, name: String, dataSourceId: Long)

class Visualizations(tag: Tag) extends Table[Visualization](tag, "VISUALIZATIONS") {
  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def dataSourceId = column[Long]("DATASOURCE_ID")

  val dataSources = TableQuery[DataSources]

  def dataSource = foreignKey("VISUALIZATION_DATASOURCE_FK", dataSourceId, dataSources)(_.id)

  def * = (id, name, dataSourceId) <> (Visualization.tupled, Visualization.unapply _)
}

object Visualizations {

  val visualizations = TableQuery[Visualizations]
  val dataSources = TableQuery[DataSources]

  def findById(id: Long)(implicit s: Session): Option[Visualization] = {
    visualizations.filter(_.id === id).firstOption
  }

  def findByIdWithDataSource(id: Long)(implicit s: Session) : Option[(Visualization, DataSource)] = {
    (for {
      (v, d) <- visualizations innerJoin dataSources on (_.dataSourceId === _.id)
    } yield (v, d)).list().headOption
  }

}