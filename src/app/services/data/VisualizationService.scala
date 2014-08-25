package services.data

import data.models.{DataSourceRow, VisualizationRow}
import play.api.db.slick.Session

trait VisualizationService extends CRUDService[VisualizationRow] {
  def list(skip: Int, take: Int)(implicit session: Session): Seq[(VisualizationRow, DataSourceRow, DataSourceRow)]
}
