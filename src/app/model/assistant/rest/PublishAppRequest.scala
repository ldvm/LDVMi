package model.assistant.rest

import play.api.libs.json.Json

object PublishAppRequest {
  case class PublishAppRequest(published: Boolean)
  implicit val writes = Json.writes[PublishAppRequest]
  implicit val reads = Json.reads[PublishAppRequest]
}
