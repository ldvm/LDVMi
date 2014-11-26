package model.entity

import model.repositories.EagerBox
import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

case class DataSourceId(id: Long) extends AnyVal with BaseId
object DataSourceId extends IdCompanion[DataSourceId]

case class DataSourceEagerBox(dataSource: DataSource, component: Component) extends EagerBox[DataSource](dataSource)

case class DataSource(
  id: Option[DataSourceId],
  componentId: ComponentId,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdEntity[DataSourceId]


class DataSourceTable(tag: Tag) extends IdEntityTable[DataSourceId, DataSource](tag, "datasources") {

  def component = foreignKey("fk_dst_ct_component_id", componentId, componentsQuery)(_.id)

  def componentId = column[ComponentId]("component_id", O.NotNull)

  def * = (id.?, componentId, createdUtc, modifiedUtc) <> (DataSource.tupled, DataSource.unapply _)
}