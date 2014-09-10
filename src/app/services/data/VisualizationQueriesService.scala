package services.data

import data.models._
import play.api.db.slick.Session

trait VisualizationQueriesService extends CRUDService[VisualizationQuery, VisualizationQueriesTable, VisualizationQueryEagerBox] {

  def findByIdAndToken(id: Long, token: String)(implicit s: Session): Option[VisualizationQuery]

}
