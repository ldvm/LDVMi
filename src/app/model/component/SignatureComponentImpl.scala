package model.component

import _root_.controllers.api.dto
import model.entity._
import model.repository.SignatureRepository
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class SignatureComponentImpl(implicit inj: Injector)
  extends SignatureComponent with Injectable {

  val repository = inject[SignatureRepository]

  def save(signature: dto.Signature, featureId: FeatureId, inputIdsByUri: Map[String, InputId])(implicit session: Session): SignatureId = {

    val signatureEntity = Signature(
      None,
      featureId,
      inputIdsByUri(signature.appliesTo.dataPort.uri),
      signature.query,
      signature.title.getOrElse("Unlabeled signature"),
      signature.description
    )

    save(signatureEntity)
  }

}