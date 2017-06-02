package model.assistant.rest.geo

import play.api.libs.json.Json

object PlacesRequest {

  case class PlacesRequest(urls: Seq[String], placeTypes: Seq[String], limit: Int)

  implicit val writes = Json.writes[PlacesRequest]
  implicit val reads = Json.reads[PlacesRequest]
}
