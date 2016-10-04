package model.assistant.entity

import model.entity.{PipelineDiscoveryId, DataSourceTemplateId}
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import scala.slick.lifted.Tag

case class UserPipelineDiscoveryId(id: Long) extends AnyVal with BaseId
object UserPipelineDiscoveryId extends IdCompanion[UserPipelineDiscoveryId]

case class UserPipelineDiscovery(
  id: Option[UserPipelineDiscoveryId],
  name: String,
  userId: UserId,
  pipelineDiscoveryId: PipelineDiscoveryId) extends WithId[UserPipelineDiscoveryId]

class UserPipelineDiscoveries(tag: Tag) extends IdTable[UserPipelineDiscoveryId, UserPipelineDiscovery](tag, "assistant_user_pipeline_discovery") {
  def name = column[String]("name", O.NotNull)
  def userId = column[UserId]("user_id", O.NotNull)
  def pipelineDiscoveryId = column[PipelineDiscoveryId]("pipeline_discovery_id", O.NotNull)

  override def * =
    (id.?, name, userId, pipelineDiscoveryId) <> (UserPipelineDiscovery.tupled, UserPipelineDiscovery.unapply)
}
