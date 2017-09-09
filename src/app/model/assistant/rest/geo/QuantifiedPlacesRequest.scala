package model.assistant.rest.geo

import play.api.libs.json.Json

object QuantifiedPlacesRequest {

  case class QuantifiedPlacesRequest(urls: Seq[String], placeTypes: Seq[String], valuePredicates: Seq[String], limit: Int)

  implicit val writes = Json.writes[QuantifiedPlacesRequest]
  implicit val reads = Json.reads[QuantifiedPlacesRequest]
}
