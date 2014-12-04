package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class DataPortBindingSetId(id: Long) extends AnyVal with BaseId

object DataPortBindingSetId extends IdCompanion[DataPortBindingSetId]

case class DataPortBindingSet(
  id: Option[DataPortBindingSetId],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[DataPortBindingSetId]


class DataPortBindingSetTable(tag: Tag) extends IdEntityTable[DataPortBindingSetId, DataPortBindingSet](tag, "dataport_binding_sets") {
  def * = (id.?, createdUtc, modifiedUtc) <>(DataPortBindingSet.tupled, DataPortBindingSet.unapply _)
}