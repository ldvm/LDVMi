package model.entity

import java.util.UUID
import model.repository.EagerBox
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class DataSourceTemplateId(id: Long) extends AnyVal with BaseId
object DataSourceTemplateId extends IdCompanion[DataSourceTemplateId]

case class DataSourceTemplateEagerBox(dataSource: DataSourceTemplate, component: ComponentTemplate) extends EagerBox[DataSourceTemplate](dataSource)

case class DataSourceTemplate(
  id: Option[DataSourceTemplateId],
  componentTemplateId: ComponentTemplateId,
  var uuid: String = UUID.randomUUID().toString,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[DataSourceTemplateId] with SpecificComponentTemplate


class DataSourceTemplateTable(tag: Tag) extends IdEntityTable[DataSourceTemplateId, DataSourceTemplate](tag, "datasource_templates") {

  def componentTemplate = foreignKey("fk_dst_ctt_component_template_id", componentTemplateId, componentTemplatesQuery)(_.id)

  def componentTemplateId = column[ComponentTemplateId]("component_template_id", O.NotNull)

  def * = (id.?, componentTemplateId, uuid, createdUtc, modifiedUtc) <> (DataSourceTemplate.tupled, DataSourceTemplate.unapply _)
}