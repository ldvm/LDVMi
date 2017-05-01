package model.assistant.rest

import play.api.libs.json.Json

object ThingsConnectionRequest {
  case class ThingsConnectionsRequest(things: Seq[String], connections: Seq[String], limit: Int)
  implicit val writes = Json.writes[ThingsConnectionsRequest]
  implicit val reads = Json.reads[ThingsConnectionsRequest]
}
