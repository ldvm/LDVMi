package model.assistant.rest

import play.api.libs.json.Json

object UrlsRequest {

  case class UrlsRequest(urls: Seq[String], limit: Int)

  implicit val writes = Json.writes[UrlsRequest]
  implicit val reads = Json.reads[UrlsRequest]
}
