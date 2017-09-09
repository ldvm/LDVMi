package model.assistant.rest.timeline

import java.util.Date

import play.api.libs.json.Json

object UrlsStartEndRequest {
  case class UrlsStartEndRequest(urls: Seq[String], start: Date, end: Date, limit: Int)
  implicit val writes = Json.writes[UrlsStartEndRequest]
  implicit val reads = Json.reads[UrlsStartEndRequest]
}
