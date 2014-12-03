package model.component

import controllers.api.dto
import model.entity._
import model.repository.SignatureRepository
import play.api.db.slick._

trait SignatureComponent extends CrudComponent[SignatureId, Signature, SignatureTable, SignatureRepository] {

  def save(signature: dto.Signature, featureId: FeatureId, inputIdsByUri: Map[String, InputId])(implicit session: Session): SignatureId

}
