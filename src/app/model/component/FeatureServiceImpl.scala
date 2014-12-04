package model.component

import _root_.controllers.api.dto
import model.entity._
import model.repository.FeatureRepository
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class FeatureServiceImpl(implicit inj: Injector) extends FeatureService with Injectable {

  val repository = inject[FeatureRepository]
  val signatureComponent = inject[SignatureService]
  val featureToComponentComponent = inject[FeatureToComponentService]

  def save(feature: dto.Feature, inputIdsByUri: Map[String, InputId], componentId: ComponentId)(implicit session: Session): FeatureId = {

    val featureEntity = Feature(
      None,
      feature.uri,
      feature.isMandatory,
      feature.title.getOrElse("Unlabeled feature"),
      feature.description
    )

    val featureId = save(featureEntity)

    feature.signatures.map { s =>
      signatureComponent.save(s, featureId, inputIdsByUri)
    }

    featureToComponentComponent.save(featureId, componentId, None)

    featureId
  }

}