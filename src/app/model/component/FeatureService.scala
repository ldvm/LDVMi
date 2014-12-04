package model.component

import controllers.api.dto
import model.entity._
import model.repository.FeatureRepository
import play.api.db.slick._

trait FeatureService extends CrudService[FeatureId, Feature, FeatureTable, FeatureRepository] {

  def save(feature: dto.Feature, inputIdsByUri: Map[String, InputId], componentId: ComponentId)(implicit session: Session) : FeatureId

}