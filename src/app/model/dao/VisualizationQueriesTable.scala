package model.dao

import model.services.EagerBox
import org.joda.time.DateTime
import play.api.db.slick.Config.driver.simple._
import PortableJodaSupport._

case class VisualizationQuery(id: Long, visualizationId: Long, token: String, storedData: String, var createdUtc: Option[DateTime] = None, var modifiedUtc: Option[DateTime] = None) extends IdentifiedEntity

class VisualizationQueriesTable(tag: Tag) extends Table[VisualizationQuery](tag, "VISUALIZATION_QUERIES") with IdentifiedEntityTable[VisualizationQuery] {
  val visualizations = TableQuery[VisualizationTable]

  def visualization = foreignKey("VISUALIZATION_QUERY_VISUALIZATION_FK", visualizationId, visualizations)(_.id)

  def visualizationId = column[Long]("VISUALIZATION_ID")

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def data = column[String]("DATA", O.NotNull)

  def token = column[String]("TOKEN", O.NotNull)

  def createdUtc = column[Option[DateTime]]("created")

  def modifiedUtc = column[Option[DateTime]]("modified")

  def * = (id, visualizationId, token, data, createdUtc, modifiedUtc) <>(VisualizationQuery.tupled, VisualizationQuery.unapply _)
}

case class VisualizationQueryEagerBox(visualizationQuery: VisualizationQuery, visualization: Visualization) extends EagerBox[VisualizationQuery] {
  override def mainEntity: VisualizationQuery = visualizationQuery
}