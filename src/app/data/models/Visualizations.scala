package data.models

import data.models.DataSources
import play.api.db.slick.Config.driver.simple._

class Visualizations(tag: Tag) extends Table[(Long, String, Long)](tag, "VISUALIZATIONS") {
  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def dataSourceId = column[Long]("DATASOURCE_ID")

  val dataSources = TableQuery[DataSources]
  def dataSource = foreignKey("VISUALIZATION_DATASOURCE_FK", dataSourceId, dataSources)(_.id)

  def * = (id, name, dataSourceId)
}