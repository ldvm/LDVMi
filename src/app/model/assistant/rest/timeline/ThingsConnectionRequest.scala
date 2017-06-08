package model.assistant.rest.timeline

import play.api.libs.json.Json

object ThingsConnectionRequest {
  case class ThingsConnectionsRequest(things: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)
  implicit val writes = Json.writes[ThingsConnectionsRequest]
  implicit val reads = Json.reads[ThingsConnectionsRequest]
}
