package model.entity

import java.util.UUID
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class DataPortTemplateId(id: Long) extends AnyVal with BaseId

object DataPortTemplateId extends IdCompanion[DataPortTemplateId]

case class DataPortTemplate(
  id: Option[DataPortTemplateId],
  uri: String,
  title: String,
  description: Option[String],
  componentTemplateId: ComponentTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends UriIdentifiedEntity[DataPortTemplateId] {

  def component (implicit session: Session) : ComponentTemplate = {
    (for {
      c <- componentTemplatesQuery if c.id === componentTemplateId
    } yield c).first
  }
}


class DataPortTemplateTable(tag: Tag) extends UriIdentifiedEntityTable[DataPortTemplateId, DataPortTemplate](tag, "dataport_templates") {

  def * = (id.?, uri, title, description, componentTemplateId, uuid, createdUtc, modifiedUtc) <>(DataPortTemplate.tupled, DataPortTemplate.unapply _)

  def componentTemplateId = column[ComponentTemplateId]("component_template_id", O.NotNull)
}