package model.assistant.rest

import play.api.libs.json.Json

object SaveAppConfigurationRequest {
  case class SaveAppConfigurationRequest(configuration: String)
  implicit val writes = Json.writes[SaveAppConfigurationRequest]
  implicit val reads = Json.reads[SaveAppConfigurationRequest]
}
