package model.services

import model.dao.{VisualizerCompatibilityTable, VisualizerCompatibility}
import play.api.db.slick.Session

trait CompatibilityService extends IdentityEagerCRUDService[VisualizerCompatibility, VisualizerCompatibilityTable] {

  def getByVisualizationId(id: Long)(implicit session: Session) : Seq[VisualizerCompatibility]

}
