package model.entity

import java.util.UUID

import model.entity.CustomUnicornPlay._
import model.entity.CustomUnicornPlay.driver.simple._
import org.joda.time.DateTime

case class DataPortBindingSetId(id: Long) extends AnyVal with BaseId

object DataPortBindingSetId extends IdCompanion[DataPortBindingSetId]

case class DataPortBindingSet(
  id: Option[DataPortBindingSetId],
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[DataPortBindingSetId] {

  def bindings(implicit session: Session): Seq[DataPortBinding] = {
    (for {
      b <- bindingsQuery if b.bindingSetId === id
    } yield b).list
  }

  def nestedBindings(implicit session: Session): Seq[NestedDataPortBinding] = {
    (for {
      b <- nestedBindingsQuery if b.bindingSetId === id
    } yield b).list
  }

  def componentInstances(implicit session: Session): Seq[ComponentInstance] = {
    (for {
      m <- componentInstanceMembershipQuery if m.bindingSetId === id
      ci <- componentInstancesQuery if ci.id === m.componentInstanceId
    } yield ci).list
  }

}


class DataPortBindingSetTable(tag: Tag) extends IdEntityTable[DataPortBindingSetId, DataPortBindingSet](tag, "dataport_binding_sets") {
  def * = (id.?, uuid, createdUtc, modifiedUtc) <>(DataPortBindingSet.tupled, DataPortBindingSet.unapply _)
}