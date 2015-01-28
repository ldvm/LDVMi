package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class FeatureId(id: Long) extends AnyVal with BaseId

object FeatureId extends IdCompanion[FeatureId]

case class Feature(
  id: Option[FeatureId],
  uri: String,
  isMandatory: Boolean,
  title: String,
  description: Option[String],
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends DescribedEntity[FeatureId] {

  def descriptors(implicit session: Session): List[Descriptor] = {
    (for {
      d <- descriptorsQuery if d.featureId === id
    } yield d).list
  }

}

object FeatureEntity {
  def apply(feature: model.dto.Feature) = {
    Feature(
      None,
      feature.uri,
      feature.isMandatory,
      feature.title.getOrElse("Unlabeled feature"),
      feature.description
    )
  }
}

class FeatureTable(tag: Tag) extends DescribedEntityTable[FeatureId, Feature](tag, "features") {

  def uri = column[String]("uri", O.NotNull)

  def isMandatory = column[Boolean]("is_mandatory", O.NotNull)

  def * = (id.?, uri, isMandatory, title, description, uuid, createdUtc, modifiedUtc) <>(Feature.tupled, Feature.unapply _)
}