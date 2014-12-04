package model.entity

import model.repository.EagerBox
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class TransformerInstanceId(id: Long) extends AnyVal with BaseId
object TransformerInstanceId extends IdCompanion[TransformerInstanceId]

case class TransformerInstanceEagerBox(transformer: TransformerInstance, component: Component) extends EagerBox[TransformerInstance](transformer)

case class TransformerInstance(
  id: Option[TransformerInstanceId],
  componentInstanceId: ComponentInstanceId,
  transformerId: TransformerId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[TransformerInstanceId]


class TransformerInstanceTable(tag: Tag) extends IdEntityTable[TransformerInstanceId, TransformerInstance](tag, "transformer_instances") {

  def transformer = foreignKey("fk_tit_dst_component_id", transformerId, transformersQuery)(_.id)

  def transformerId = column[TransformerId]("transformer_id", O.NotNull)

  def * = (id.?, componentInstanceId, transformerId, createdUtc, modifiedUtc) <> (TransformerInstance.tupled, TransformerInstance.unapply _)

  def componentInstance = foreignKey("fk_tit_cit_component_instance_id", componentInstanceId, componentInstancesQuery)(_.id)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)
}