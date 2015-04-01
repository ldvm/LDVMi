package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class FeatureToComponentId(id: Long) extends AnyVal with BaseId

object FeatureToComponentId extends IdCompanion[FeatureToComponentId]

case class FeatureToComponent(
  id: Option[FeatureToComponentId],
  componentId: ComponentTemplateId,
  featureId: FeatureId,
  ordering: Option[Int],
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[FeatureToComponentId]


class FeatureToComponentTable(tag: Tag) extends IdEntityTable[FeatureToComponentId, FeatureToComponent](tag, "feature_to_component") {

  def component = foreignKey("fk_ftc_ct_component_id", componentTemplateId, componentTemplatesQuery)(_.id)

  def componentTemplateId = column[ComponentTemplateId]("component_id", O.NotNull)

  def feature = foreignKey("fk_ftc_ft_feature_id", featureId, featuresQuery)(_.id)

  def featureId = column[FeatureId]("feature_id", O.NotNull)

  def ordering = column[Option[Int]]("ordering")

  def * = (id.?, componentTemplateId, featureId, ordering, uuid, createdUtc, modifiedUtc) <>(FeatureToComponent.tupled, FeatureToComponent.unapply _)
}