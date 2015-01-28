package model.entity

import java.util.UUID

import model.repository.EagerBox
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class TransformerInstanceId(id: Long) extends AnyVal with BaseId
object TransformerInstanceId extends IdCompanion[TransformerInstanceId]

case class TransformerInstanceEagerBox(transformer: TransformerInstance, component: ComponentTemplate) extends EagerBox[TransformerInstance](transformer)

case class TransformerInstance(
  id: Option[TransformerInstanceId],
  componentInstanceId: ComponentInstanceId,
  transformerId: TransformerTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[TransformerInstanceId]


class TransformerInstanceTable(tag: Tag) extends IdEntityTable[TransformerInstanceId, TransformerInstance](tag, "transformer_instances") {

  def transformer = foreignKey("fk_tit_dst_component_id", transformerId, transformerTemplatesQuery)(_.id)

  def transformerId = column[TransformerTemplateId]("transformer_id", O.NotNull)

  def * = (id.?, componentInstanceId, transformerId, uuid, createdUtc, modifiedUtc) <> (TransformerInstance.tupled, TransformerInstance.unapply _)

  def componentInstance = foreignKey("fk_tit_cit_component_instance_id", componentInstanceId, componentInstancesQuery)(_.id)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)
}