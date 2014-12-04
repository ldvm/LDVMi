package model.component

import model.entity._
import model.repository.FeatureToComponentRepository
import play.api.db.slick._

trait FeatureToComponentService extends CrudService[FeatureToComponentId, FeatureToComponent, FeatureToComponentTable, FeatureToComponentRepository] {

  def save(featureId: FeatureId, componentId: ComponentId, ordering: Option[Int])(implicit session: Session): FeatureToComponentId

}