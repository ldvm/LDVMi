package model.appgen.entity

import model.entity.{ComponentTemplateId, PipelineId}
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import scala.slick.lifted.Tag

case class ApplicationId(id: Long) extends AnyVal with BaseId
object ApplicationId extends IdCompanion[ApplicationId]

case class Application(
  id: Option[ApplicationId],
  name: String,
  uid: String,
  description: Option[String],
  userId: UserId,
  pipelineId: PipelineId,
  userPipelineDiscoveryId: UserPipelineDiscoveryId,
  visualizerComponentTemplateId: ComponentTemplateId)
  extends WithId[ApplicationId]


class Applications(tag: Tag) extends IdTable[ApplicationId, Application](tag, "appgen_applications") {
  def name = column[String]("name", O.NotNull)
  def uid = column[String]("uid", O.NotNull)
  def description = column[String]("description", O.Nullable)
  def userId = column[UserId]("user_id", O.NotNull)
  def pipelineId = column[PipelineId]("pipeline_id", O.NotNull)
  def userPipelineDiscoveryId = column[UserPipelineDiscoveryId]("user_pipeline_discovery_id", O.NotNull)
  def visualizerComponentTemplateId = column[ComponentTemplateId]("visualizer_component_template_id", O.NotNull)

  override def * = (id.?, name, uid, description.?, userId, pipelineId, userPipelineDiscoveryId, visualizerComponentTemplateId) <> (Application.tupled, Application.unapply)
}
