package model.assistant.rest

import play.api.libs.json.Json

object UpdateAppSettingsRequest {
  case class UpdateAppSettingsRequest(name: String, description: String, updateUrl: Boolean)
  implicit val writes = Json.writes[UpdateAppSettingsRequest]
  implicit val reads = Json.reads[UpdateAppSettingsRequest]
}
