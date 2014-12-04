package model.component

import _root_.controllers.api.dto
import model.entity._
import model.repository.{FeatureToComponentRepository, FeatureRepository}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class FeatureToComponentServiceImpl(implicit inj: Injector) extends FeatureToComponentService with Injectable {

  val repository = inject[FeatureToComponentRepository]

  def save(featureId: FeatureId, componentId: ComponentId, ordering: Option[Int])(implicit session: Session): FeatureToComponentId = {
    save(FeatureToComponent(None, componentId, featureId, ordering))
  }
}