package model.entity

import java.util.UUID

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._
import play.api.db.slick.Session

case class InputInstanceId(id: Long) extends AnyVal with BaseId
object InputInstanceId extends IdCompanion[InputInstanceId]

case class InputInstance(
  id: Option[InputInstanceId],
  dataPortInstanceId: DataPortInstanceId,
  inputTemplateId: InputTemplateId,
  componentInstanceId: ComponentInstanceId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[InputInstanceId] {

  def dataPortInstance(implicit session: Session) : DataPortInstance = {
    (for {
      d <- dataPortInstancesQuery if d.id === dataPortInstanceId
    } yield d).first
  }

  def componentInstance(implicit session: Session) : ComponentInstance = {
    (for {
      ci <- componentInstancesQuery if ci.id === componentInstanceId
    } yield ci).first
  }
}


class InputInstanceTable(tag: Tag) extends IdEntityTable[InputInstanceId, InputInstance](tag, "input_instances") {

  def dataPortInstanceId = column[DataPortInstanceId]("dataport_instance_id", O.NotNull)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)

  def inputId = column[InputTemplateId]("input_id", O.NotNull)

  def * = (id.?, dataPortInstanceId, inputId, componentInstanceId, uuid, createdUtc, modifiedUtc) <> (InputInstance.tupled, InputInstance.unapply _)
}