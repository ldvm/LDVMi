package model.assistant.entity

import model.entity.DataSourceTemplateId
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import scala.slick.lifted.Tag

case class UserDataSourceId(id: Long) extends AnyVal with BaseId
object UserDataSourceId extends IdCompanion[UserDataSourceId]

case class UserDataSource(
  id: Option[UserDataSourceId],
  name: String,
  isPublic: Boolean,
  userId: UserId,
  dataSourceTemplateId: DataSourceTemplateId) extends WithId[UserDataSourceId]

class UserDataSources(tag: Tag) extends IdTable[UserDataSourceId, UserDataSource](tag, "assistant_user_datasources") {
  def name = column[String]("name", O.NotNull)
  def isPublic = column[Boolean]("isPublic", O.NotNull)
  def userId = column[UserId]("user_id", O.NotNull)
  def dataSourceTemplateId = column[DataSourceTemplateId]("datasource_template_id", O.NotNull)

  override def * =
    (id.?, name, isPublic, userId, dataSourceTemplateId) <> (UserDataSource.tupled, UserDataSource.unapply)
}
