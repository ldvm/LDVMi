package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class TransformerId(id: Long) extends AnyVal with BaseId
object TransformerId extends IdCompanion[TransformerId]

case class Transformer(
  id: Option[TransformerId],
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[TransformerId] with ConcreteComponent


class TransformerTable(tag: Tag) extends IdEntityTable[TransformerId, Transformer](tag, "transformer") {

  def component = foreignKey("fk_tt_ct_component_id", componentId, componentsQuery)(_.id)

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def * = (id.?, componentId, createdUtc, modifiedUtc) <> (Transformer.tupled, Transformer.unapply _)
}