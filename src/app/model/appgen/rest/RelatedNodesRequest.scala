package model.appgen.rest

import play.api.libs.json.Json

object RelatedNodesRequest {
  case class RelatedNodesRequest(nodeUri: String)
  implicit val writes = Json.writes[RelatedNodesRequest]
  implicit val reads = Json.reads[RelatedNodesRequest]
}
