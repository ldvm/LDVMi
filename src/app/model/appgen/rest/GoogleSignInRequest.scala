package model.appgen.rest

import play.api.libs.json.Json

object GoogleSignInRequest {
  case class GoogleSignInRequest(token: String)
  implicit val writes = Json.writes[GoogleSignInRequest]
  implicit val reads = Json.reads[GoogleSignInRequest]
}
