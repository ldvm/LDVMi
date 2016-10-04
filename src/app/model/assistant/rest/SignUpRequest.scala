package model.assistant.rest

import play.api.libs.json.Json

object SignUpRequest {
  case class SignUpRequest(name: String, email: String, password: String)
  implicit val writes = Json.writes[SignUpRequest]
  implicit val reads = Json.reads[SignUpRequest]
}
