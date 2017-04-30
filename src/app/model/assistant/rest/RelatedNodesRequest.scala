package model.assistant.rest
import model.rdf.sparql.rgml.models.EdgeDirection._

import play.api.libs.json.Json

object RelatedNodesRequest {
  case class RelatedNodesRequest(nodeUri: String, direction: Option[EdgeDirection])
  implicit val writes = Json.writes[RelatedNodesRequest]
  implicit val reads = Json.reads[RelatedNodesRequest]
}
