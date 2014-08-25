package data.models

import play.api.db.slick.Config.driver.simple._

case class VisualizationQuery(id: Long, visualizationId: Long, token: String, storedData: String)

class VisualizationQueries(tag: Tag) extends Table[VisualizationQuery](tag, "VISUALIZATION_QUERIES") {
  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def data = column[String]("DATA", O.NotNull)

  def token = column[String]("TOKEN", O.NotNull)

  def visualizationId = column[Long]("VISUALIZATION_ID")

  val visualizations = TableQuery[VisualizationsTable]

  def visualization = foreignKey("VISUALIZATION_QUERY_VISUALIZATION_FK", visualizationId, visualizations)(_.id)

  def * = (id, visualizationId, token, data) <> (VisualizationQuery.tupled, VisualizationQuery.unapply _)
}

object VisualizationQueries {

  val visualizationQueries = TableQuery[VisualizationQueries]
  val visualizations = TableQuery[VisualizationsTable]

  def findById(id: Long)(implicit s: Session): Option[VisualizationQuery] = {
    visualizationQueries.filter(_.id === id).firstOption
  }

  def findByIdAndToken(id: Long, token: String)(implicit s: Session) : Option[VisualizationQuery] = {
    visualizationQueries.filter(v => v.visualizationId === id && v.token === token).firstOption
  }

  def findByIdWithVisualization(id: Long)(implicit s: Session) : Option[(VisualizationQuery, VisualizationRow)] = {
    (for {
      (vq, v) <- visualizationQueries innerJoin visualizations on (_.visualizationId === _.id)
    } yield (vq, v)).list().headOption
  }

}