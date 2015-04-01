package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class DataPortInstanceId(id: Long) extends AnyVal with BaseId

object DataPortInstanceId extends IdCompanion[DataPortInstanceId]

case class DataPortInstance(
  id: Option[DataPortInstanceId],
  uri: String,
  title: String,
  description: Option[String],
  componentInstanceId: ComponentInstanceId,
  dataPortTemplateId: DataPortTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends UriIdentifiedEntity[DataPortInstanceId] {

  def dataPortTemplate(implicit session: Session) : DataPortTemplate = {
    (for{
      d <- dataPortTemplatesQuery if d.id === dataPortTemplateId
    } yield d).first
  }

  def componentInstance(implicit session: Session) : ComponentInstance = {
    (for{
      ci <- componentInstancesQuery if ci.id === componentInstanceId
    } yield ci).first
  }

}


class DataPortInstanceTable(tag: Tag) extends UriIdentifiedEntityTable[DataPortInstanceId, DataPortInstance](tag, "dataport_instances") {

  def * = (id.?, uri, title, description, componentInstanceId, dataPortId, uuid, createdUtc, modifiedUtc) <> (DataPortInstance.tupled, DataPortInstance.unapply _)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)

  def dataPortId = column[DataPortTemplateId]("data_port_id", O.NotNull)
}