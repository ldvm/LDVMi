package services.data

import data.models.{DataSourceRow, VisualizationRow, VisualizationsTable}
import play.api.db.slick.Session

class VisualizationServiceImpl extends VisualizationService {
  def list(skip: Int, take: Int)(implicit s: Session): Seq[(VisualizationRow, DataSourceRow, DataSourceRow)] = {
    VisualizationsTable.listWithDataSources(skip, take)
  }
}
