package model.dao

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class DataPortBindingSetId(id: Long) extends AnyVal with BaseId

object DataPortBindingSetId extends IdCompanion[DataPortBindingSetId]

case class DataPortBindingSet(
  id: Option[DataPortBindingSetId],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity


class DataPortBindingSetTable(tag: Tag) extends IdEntityTable[DataPortBindingSetId, DataPortBindingSet](tag, "dataport_binding_sets") {
  def * = (id, createdUtc, modifiedUtc) <>(DataPortBindingSet.tupled, DataPortBindingSet.unapply _)
}