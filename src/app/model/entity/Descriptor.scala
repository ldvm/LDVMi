package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class DescriptiorId(id: Long) extends AnyVal with BaseId

object DescriptiorId extends IdCompanion[DescriptiorId]

case class Descriptor(
  id: Option[DescriptiorId],
  featureId: FeatureId,
  inputId: InputId,
  query: String,
  title: String,
  description: Option[String],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends DescribedEntity[DescriptiorId]

object DescriptorEntity {
  def apply(featureId: FeatureId, inputId: InputId, descriptor: model.dto.Descriptor) = {
    Descriptor(
      None,
      featureId,
      inputId,
      descriptor.query,
      descriptor.title.getOrElse("Unlabeled descriptor"),
      descriptor.description
    )
  }
}

class DescriptorTable(tag: Tag) extends DescribedEntityTable[DescriptiorId, Descriptor](tag, "descriptors") {

  def feature = foreignKey("fk_dt_ft_feature_id", featureId, featuresQuery)(_.id)

  def featureId = column[FeatureId]("feature_id", O.NotNull)

  def input = foreignKey("fk_dt_it_input_id", inputId, inputsQuery)(_.id)

  def inputId = column[InputId]("input_id", O.NotNull)

  def query = column[String]("query", O.NotNull)

  def * = (id.?, featureId, inputId, query, title, description, createdUtc, modifiedUtc) <>(Descriptor.tupled, Descriptor.unapply _)
}