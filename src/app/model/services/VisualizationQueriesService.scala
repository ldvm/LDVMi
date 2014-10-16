package model.services

import model.dao.{VisualizationQueryEagerBox, VisualizationQueriesTable, VisualizationQuery}
import play.api.db.slick.Session

trait VisualizationQueriesService extends CRUDService[VisualizationQuery, VisualizationQueriesTable, VisualizationQueryEagerBox] {

  def findByIdAndToken(id: Long, token: String)(implicit s: Session): Option[VisualizationQuery]

  def deleteByToken(token: String)(implicit s: Session)

}
