package services.data

import data.models.{VisualizationTable, VisualizationEagerBox, DataSource, Visualization}
import play.api.db.slick.Session

trait VisualizationService extends CRUDService[Visualization, VisualizationTable, VisualizationEagerBox] {

}
