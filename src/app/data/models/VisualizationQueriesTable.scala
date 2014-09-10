package data.models

import play.api.db.slick.Config.driver.simple._
import services.data.EagerBox

case class VisualizationQuery(id: Long, visualizationId: Long, token: String, storedData: String)

class VisualizationQueriesTable(tag: Tag) extends Table[VisualizationQuery](tag, "VISUALIZATION_QUERIES") with IdentifiedEntityTable[VisualizationQuery] {
  val visualizations = TableQuery[VisualizationTable]

  def visualization = foreignKey("VISUALIZATION_QUERY_VISUALIZATION_FK", visualizationId, visualizations)(_.id)

  def visualizationId = column[Long]("VISUALIZATION_ID")

  def * = (id, visualizationId, token, data) <>(VisualizationQuery.tupled, VisualizationQuery.unapply _)

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def data = column[String]("DATA", O.NotNull)

  def token = column[String]("TOKEN", O.NotNull)
}

case class VisualizationQueryEagerBox(visualizationQuery: VisualizationQuery, visualization: Visualization) extends EagerBox[VisualizationQuery]