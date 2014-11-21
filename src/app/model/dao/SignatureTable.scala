package model.dao

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class SignatureId(id: Long) extends AnyVal with BaseId

object SignatureId extends IdCompanion[SignatureId]

case class Signature(
  id: Option[SignatureId],
  featureId: FeatureId,
  inputId: InputId,
  query: String,
  title: String,
  description: Option[String],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity


class SignatureTable(tag: Tag) extends IdEntityTable[SignatureId, Signature](tag, "signatures") {

  val features = TableQuery[FeatureTable]

  val inputs = TableQuery[InputTable]

  def feature = foreignKey("fk_st_ft_feature_id", featureId, features)(_.id)

  def featureId = column[FeatureId]("feature_id", O.NotNull)

  def input = foreignKey("fk_st_it_input_id", inputId, inputs)(_.id)

  def inputId = column[InputId]("input_id", O.NotNull)

  def * = (id, featureId, inputId, createdUtc, modifiedUtc) <>(Signature.tupled, Signature.unapply _)
}