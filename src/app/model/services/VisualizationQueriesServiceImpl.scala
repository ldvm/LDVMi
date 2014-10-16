package model.services

import model.dao.{VisualizationTable, VisualizationQueryEagerBox, VisualizationQuery, VisualizationQueriesTable}
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class VisualizationQueriesServiceImpl extends VisualizationQueriesService {

  override val tableReference = TableQuery[VisualizationQueriesTable]
  val visualizations = TableQuery[VisualizationTable]

  def findByIdAndToken(id: Long, token: String)(implicit s: Session): Option[VisualizationQuery] = {
    tableReference.filter(v => v.visualizationId === id && v.token === token).firstOption
  }

  def getByIdWithEager(id: Long)(implicit s: Session): Option[VisualizationQueryEagerBox] = {
    (for {
      (vq, v) <- tableReference innerJoin visualizations on (_.visualizationId === _.id)
    } yield (vq, v)).firstOption.map((VisualizationQueryEagerBox.apply _).tupled)
  }

  def listWithEager(skip: Int, take: Int)(implicit s: Session): Seq[VisualizationQueryEagerBox] = {
    (for {
      (vq, v) <- tableReference innerJoin visualizations on (_.visualizationId === _.id)
    } yield (vq, v)).list.map((VisualizationQueryEagerBox.apply _).tupled)
  }

  def deleteByToken(token: String)(implicit s: Session) = {
    tableReference.filter(_.token === token).delete
  }
}
