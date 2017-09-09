package model.assistant.rest.geo

import play.api.libs.json.Json

object QuantifiedThingsRequest {

  case class QuantifiedThingsRequest(urls: Seq[String], valuePredicates: Seq[String], placePredicates: Seq[String], limit: Int)

  implicit val writes = Json.writes[QuantifiedThingsRequest]
  implicit val reads = Json.reads[QuantifiedThingsRequest]
}
