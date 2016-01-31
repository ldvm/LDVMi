package model.appgen.rest

import play.api.libs.json.Json

object SignInRequest {
  case class SignInRequest(email: String, password: String)
  implicit val writes = Json.writes[SignInRequest]
  implicit val reads = Json.reads[SignInRequest]
}
