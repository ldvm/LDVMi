package model.entity

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class TransformerId(id: Long) extends AnyVal with BaseId
object TransformerId extends IdCompanion[TransformerId]

case class Transformer(
  id: Option[TransformerId],
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[TransformerId]


class TransformerTable(tag: Tag) extends IdEntityTable[TransformerId, Transformer](tag, "transformer") {

  val components = TableQuery[ComponentTable]

  def component = foreignKey("fk_tt_ct_component_id", componentId, components)(_.id)

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def * = (id.?, componentId, createdUtc, modifiedUtc) <> (Transformer.tupled, Transformer.unapply _)
}