package model.assistant.rest

import play.api.libs.json.Json

object GetCommentsRequest {
  case class GetCommentsRequest(resourceUris: Seq[String])
  implicit val writes = Json.writes[GetCommentsRequest]
  implicit val reads = Json.reads[GetCommentsRequest]
}
