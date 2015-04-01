package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class DescriptorId(id: Long) extends AnyVal with BaseId

object DescriptorId extends IdCompanion[DescriptorId]

case class Descriptor(
  id: Option[DescriptorId],
  featureId: FeatureId,
  inputTemplateId: InputTemplateId,
  query: String,
  title: String,
  description: Option[String],
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends DescribedEntity[DescriptorId] {

  def inputTemplate(implicit session: Session) : InputTemplate = {
    (for {
      i <- inputTemplatesQuery if i.id === inputTemplateId
    } yield i).first
  }

}

object DescriptorEntity {
  def apply(featureId: FeatureId, inputTemplateId: InputTemplateId, descriptor: model.dto.Descriptor) = {
    Descriptor(
      None,
      featureId,
      inputTemplateId,
      descriptor.query,
      descriptor.title.getOrElse("Unlabeled descriptor"),
      descriptor.description
    )
  }
}

class DescriptorTable(tag: Tag) extends DescribedEntityTable[DescriptorId, Descriptor](tag, "descriptors") {

  def feature = foreignKey("fk_dt_ft_feature_id", featureId, featuresQuery)(_.id)

  def featureId = column[FeatureId]("feature_id", O.NotNull)

  def inputTemplate = foreignKey("fk_dt_itt_input_template_id", inputTemplateId, inputTemplatesQuery)(_.id)

  def inputTemplateId = column[InputTemplateId]("input_template_id", O.NotNull)

  def query = column[String]("query", O.NotNull)

  def * = (id.?, featureId, inputTemplateId, query, title, description, uuid, createdUtc, modifiedUtc) <>(Descriptor.tupled, Descriptor.unapply _)
}