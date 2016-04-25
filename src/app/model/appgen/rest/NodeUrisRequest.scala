package model.appgen.rest

import play.api.libs.json.Json

object NodeUrisRequest {
  case class NodeUrisRequest(nodeUris: Seq[String])
  implicit val writes = Json.writes[NodeUrisRequest]
  implicit val reads = Json.reads[NodeUrisRequest]
}
