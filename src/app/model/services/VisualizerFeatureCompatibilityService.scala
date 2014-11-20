package model.services

import model.dao._
import play.api.db.slick.Session

trait VisualizerFeatureCompatibilityService extends CRUDService[
  FeatureCompatibility,
  FeatureCompatibilityTable,
  FeatureCompatibilityEagerBox
  ] {

  def getByFeatureId(id: Long)(implicit session: Session): Seq[FeatureCompatibilityEagerBox]

}
