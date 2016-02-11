package model.appgen.rest

import play.api.libs.json.Json

object AddDataSourceRequest {
  case class AddDataSourceRequest(
    name: String,
    isPublic: Boolean,
    url: String,
    graphUris: Option[Seq[String]])
  implicit val writes = Json.writes[AddDataSourceRequest]
  implicit val reads = Json.reads[AddDataSourceRequest]
}
