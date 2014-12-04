package model.entity
/*
import model.services.EagerBox
import org.joda.time.DateTime
import play.api.db.slick.Config.driver.simple._
import PortableJodaSupport._

case class VisualisationQuery(id: Long, visualizationId: Long, token: String, storedData: String, var createdUtc: Option[DateTime] = None, var modifiedUtc: Option[DateTime] = None) extends IdEntity

class VisualizationQueriesTable(tag: Tag) extends Table[VisualisationQuery](tag, "visualisation_queries") with IdEntityTable[VisualisationQuery] {
  val pipelines = TableQuery[InputBinding]

  def visualization = foreignKey("fk_vqt_vt_visualisation_id", visualizationId, pipelines)(_.id)

  def visualizationId = column[Long]("VISUALIZATION_ID")

  def data = column[String]("DATA", O.NotNull)

  def token = column[String]("TOKEN", O.NotNull)

  def * = (id, visualizationId, token, data, createdUtc, modifiedUtc) <>(VisualisationQuery.tupled, VisualisationQuery.unapply _)
}

case class VisualizationQueryEagerBox(visualizationQuery: VisualisationQuery, visualization: Visualization) extends EagerBox[VisualisationQuery] {
  override def mainEntity: VisualisationQuery = visualizationQuery
}*/