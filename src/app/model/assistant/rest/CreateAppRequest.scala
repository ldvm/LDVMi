package model.assistant.rest

import play.api.libs.json.Json

object CreateAppRequest {
  case class CreateAppRequest(
    name: String,
    pipelineId: Long)
  implicit val writes = Json.writes[CreateAppRequest]
  implicit val reads = Json.reads[CreateAppRequest]
}
