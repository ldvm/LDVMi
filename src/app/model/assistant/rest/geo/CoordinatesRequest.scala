package model.assistant.rest.geo

import play.api.libs.json.Json

object CoordinatesRequest {

  case class CoordinatesRequest(urls: Seq[String], limit: Int)

  implicit val writes = Json.writes[CoordinatesRequest]
  implicit val reads = Json.reads[CoordinatesRequest]
}
