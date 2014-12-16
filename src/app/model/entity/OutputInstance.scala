package model.entity

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._
import play.api.db.slick.Session

case class OutputInstanceId(id: Long) extends AnyVal with BaseId

object OutputInstanceId extends IdCompanion[OutputInstanceId]

case class OutputInstance(
  id: Option[OutputInstanceId],
  dataPortInstanceId: DataPortInstanceId,
  outputId: OutputId,
  componentInstanceId: ComponentInstanceId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[OutputInstanceId] {

  def output(implicit session: Session) : Output = {
    (for {
      o <- outputsQuery if o.id === outputId
    } yield o).first
  }

  def componentInstance(implicit session: Session) : ComponentInstance = {
    (for {
      ci <- componentInstancesQuery if ci.id === componentInstanceId
    } yield ci).first
  }

}


class OutputInstanceTable(tag: Tag) extends IdEntityTable[OutputInstanceId, OutputInstance](tag, "output_instances") {

  def * = (id.?, dataPortInstanceId, outputId, componentInstanceId, createdUtc, modifiedUtc) <>(OutputInstance.tupled, OutputInstance.unapply _)

  def dataPortInstanceId = column[DataPortInstanceId]("dataport_instance_id", O.NotNull)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)

  def outputId = column[OutputId]("output_id", O.NotNull)
}