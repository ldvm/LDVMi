package model.appgen.entity

import java.text.Normalizer

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
  published: Boolean,
  userId: UserId,
  pipelineId: PipelineId,
  userPipelineDiscoveryId: UserPipelineDiscoveryId,
  visualizerComponentTemplateId: ComponentTemplateId,
  configuration: Option[String])
  extends WithId[ApplicationId] {

  def withUpdatedUid = {
    val newUid = Normalizer
      .normalize(name, Normalizer.Form.NFD)
      .replaceAll("[^\\p{ASCII}]", "")
      .replaceAll("[^a-zA-Z0-9 ]", "")
      .replaceAll(" +", " ")
      .trim().toLowerCase()
      .replaceAll(" ", "-")

    copy(uid = newUid)
  }
}


class Applications(tag: Tag) extends IdTable[ApplicationId, Application](tag, "appgen_applications") {
  def name = column[String]("name", O.NotNull)
  def uid = column[String]("uid", O.NotNull)
  def description = column[String]("description", O.Nullable)
  def published = column[Boolean]("published", O.Default(false))
  def userId = column[UserId]("user_id", O.NotNull)
  def pipelineId = column[PipelineId]("pipeline_id", O.NotNull)
  def userPipelineDiscoveryId = column[UserPipelineDiscoveryId]("user_pipeline_discovery_id", O.NotNull)
  def visualizerComponentTemplateId = column[ComponentTemplateId]("visualizer_component_template_id", O.NotNull)
  def configuration = column[String]("configuration", O.Nullable)

  override def * = (id.?, name, uid, description.?, published, userId, pipelineId, userPipelineDiscoveryId,
    visualizerComponentTemplateId, configuration.?) <> (Application.tupled, Application.unapply)
}
