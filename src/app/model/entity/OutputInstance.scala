package model.entity

import java.util.UUID

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._
import play.api.db.slick.Session

case class OutputInstanceId(id: Long) extends AnyVal with BaseId

object OutputInstanceId extends IdCompanion[OutputInstanceId]

case class OutputInstance(
  id: Option[OutputInstanceId],
  dataPortInstanceId: DataPortInstanceId,
  outputId: OutputTemplateId,
  componentInstanceId: ComponentInstanceId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[OutputInstanceId] {

  def output(implicit session: Session) : OutputTemplate = {
    (for {
      o <- outputTemplatesQuery if o.id === outputId
    } yield o).first
  }

  def componentInstance(implicit session: Session) : ComponentInstance = {
    (for {
      ci <- componentInstancesQuery if ci.id === componentInstanceId
    } yield ci).first
  }

}


class OutputInstanceTable(tag: Tag) extends IdEntityTable[OutputInstanceId, OutputInstance](tag, "output_instances") {

  def * = (id.?, dataPortInstanceId, outputId, componentInstanceId, uuid, createdUtc, modifiedUtc) <>(OutputInstance.tupled, OutputInstance.unapply _)

  def dataPortInstanceId = column[DataPortInstanceId]("dataport_instance_id", O.NotNull)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)

  def outputId = column[OutputTemplateId]("output_id", O.NotNull)
}