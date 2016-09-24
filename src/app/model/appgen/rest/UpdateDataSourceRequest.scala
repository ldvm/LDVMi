package model.appgen.rest

import play.api.libs.json.Json

object UpdateDataSourceRequest {
  case class UpdateDataSourceRequest(
    name: String,
    isPublic: Boolean)
  implicit val writes = Json.writes[UpdateDataSourceRequest]
  implicit val reads = Json.reads[UpdateDataSourceRequest]
}
