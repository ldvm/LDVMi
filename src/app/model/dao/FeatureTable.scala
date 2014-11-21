package model.dao

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class FeatureId(id: Long) extends AnyVal with BaseId

object FeatureId extends IdCompanion[FeatureId]

case class Feature(
  id: Option[FeatureId],
  uri: String,
  isMandatory: Boolean,
  title: String,
  description: Option[String],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity


class FeatureTable(tag: Tag) extends DescribedEntityTable[FeatureId, Feature](tag, "features") {

  def uri = column[String]("uri", O.NotNull)

  def isMandatory = column[Boolean]("is_mandatory", O.NotNull)

  def * = (id, uri, isMandatory, title, description, modifiedUtc) <>(Feature.tupled, Feature.unapply _)
}