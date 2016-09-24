package model.appgen.rest

import play.api.libs.json.Json

object SearchRequest {
  case class SearchRequest(needle: String)
  implicit val writes = Json.writes[SearchRequest]
  implicit val reads = Json.reads[SearchRequest]
}
