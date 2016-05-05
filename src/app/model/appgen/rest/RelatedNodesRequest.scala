package model.appgen.rest
import model.rdf.sparql.rgml.EdgeDirection._

import play.api.libs.json.Json

object RelatedNodesRequest {
  case class RelatedNodesRequest(nodeUri: String, direction: EdgeDirection)
  implicit val writes = Json.writes[RelatedNodesRequest]
  implicit val reads = Json.reads[RelatedNodesRequest]
}
