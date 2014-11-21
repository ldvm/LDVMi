package model.dao

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class FeatureToComponentId(id: Long) extends AnyVal with BaseId

object FeatureToComponentId extends IdCompanion[FeatureToComponentId]

case class FeatureToComponent(
  id: Option[FeatureToComponentId],
  componentId: ComponentId,
  featureId: FeatureId,
  ordering: Int,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity


class FeatureToComponentTable(tag: Tag) extends IdEntityTable[FeatureToComponentId, FeatureToComponent](tag, "feature_to_component") {

  val components = TableQuery[ComponentTable]
  val features = TableQuery[FeatureTable]

  def component = foreignKey("fk_ftc_ct_component_id", componentId, components)(_.id)

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def feature = foreignKey("fk_ftc_ft_feature_id", featureId, features)(_.id)

  def featureId = column[ComponentId]("feature_id", O.NotNull)

  def ordering = column[Int]("ordering", O.NotNull)

  def * = (id, componentId, featureId, ordering, createdUtc, modifiedUtc) <>(FeatureToComponent.tupled, FeatureToComponent.unapply _)
}