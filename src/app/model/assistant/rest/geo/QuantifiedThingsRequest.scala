package model.assistant.rest.geo

import play.api.libs.json.Json

object QuantifiedThingsRequest {

  case class QuantifiedThingsRequest(urls: Seq[String], valueConnections: Seq[String], placeConnections: Seq[String], limit: Int)

  implicit val writes = Json.writes[QuantifiedThingsRequest]
  implicit val reads = Json.reads[QuantifiedThingsRequest]
}
