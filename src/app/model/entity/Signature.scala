package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

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
  ) extends DescribedEntity[SignatureId]


class SignatureTable(tag: Tag) extends DescribedEntityTable[SignatureId, Signature](tag, "signatures") {

  def feature = foreignKey("fk_st_ft_feature_id", featureId, featuresQuery)(_.id)

  def featureId = column[FeatureId]("feature_id", O.NotNull)

  def input = foreignKey("fk_st_it_input_id", inputId, inputsQuery)(_.id)

  def inputId = column[InputId]("input_id", O.NotNull)

  def query = column[String]("query", O.NotNull)

  def * = (id.?, featureId, inputId, query, title, description, createdUtc, modifiedUtc) <>(Signature.tupled, Signature.unapply _)
}