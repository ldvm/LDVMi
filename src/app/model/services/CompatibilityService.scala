package model.services

import model.dao.{VisualizerCompatibilityEagerBox, VisualizerCompatibilityTable, VisualizerCompatibility}
import play.api.db.slick.Session

trait CompatibilityService extends CRUDService[VisualizerCompatibility, VisualizerCompatibilityTable, VisualizerCompatibilityEagerBox] {

  def getByVisualizationId(id: Long)(implicit session: Session): Seq[VisualizerCompatibilityEagerBox]

}
