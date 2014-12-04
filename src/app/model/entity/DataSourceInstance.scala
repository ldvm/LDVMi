package model.entity

import java.util.UUID
import model.repository.EagerBox
import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

case class DataSourceInstanceId(id: Long) extends AnyVal with BaseId
object DataSourceInstanceId extends IdCompanion[DataSourceInstanceId]

case class DataSourceInstanceEagerBox(dataSource: DataSourceInstance, component: Component) extends EagerBox[DataSourceInstance](dataSource)

case class DataSourceInstance(
  id: Option[DataSourceInstanceId],
  componentInstanceId: ComponentInstanceId,
  dataSourceId: DataSourceId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[DataSourceInstanceId]


class DataSourceInstanceTable(tag: Tag) extends IdEntityTable[DataSourceInstanceId, DataSourceInstance](tag, "datasource_instances") {

  def dataSource = foreignKey("fk_dsit_dst_component_id", dataSourceId, dataSourcesQuery)(_.id)

  def dataSourceId = column[DataSourceId]("datasource_id", O.NotNull)

  def * = (id.?, componentInstanceId, dataSourceId, createdUtc, modifiedUtc) <> (DataSourceInstance.tupled, DataSourceInstance.unapply _)

  def componentInstance = foreignKey("fk_dsit_cit_component_instance_id", componentInstanceId, componentInstancesQuery)(_.id)

  def componentInstanceId = column[ComponentInstanceId]("component_instance_id", O.NotNull)
}