package model.dao

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class DataPortBindingToBindingSetId(id: Long) extends AnyVal with BaseId

object DataPortBindingToBindingSetId extends IdCompanion[DataPortBindingToBindingSetId]

case class DataPortBindingToBindingSet(
  id: Option[DataPortBindingToBindingSetId],
  setId: DataPortBindingSetId,
  bindingId: InputId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity


class DataPortBindingToBindingSetTable(tag: Tag) extends IdEntityTable[DataPortBindingToBindingSetId, DataPortBindingToBindingSet](tag, "dataport_binding_to_binding_set") {

  val bindingSets = TableQuery[DataPortBindingSetTable]
  val inputs = TableQuery[InputTable]

  def set = foreignKey("fk_dpbtbs_dpbs_binding_set_id", setId, bindingSets)(_.id)

  def setId = column[DataPortId]("set_id", O.NotNull)

  def binding = foreignKey("fk_dpbtbs_dpb_binding_id", bindingId, inputs)(_.id)

  def bindingId = column[DataPortId]("binding_id", O.NotNull)

  def * = (id, setId, bindingId, createdUtc, modifiedUtc) <>(DataPortBindingToBindingSet.tupled, DataPortBindingToBindingSet.unapply _)
}