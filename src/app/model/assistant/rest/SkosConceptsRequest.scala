package model.assistant.rest

import play.api.libs.json.Json

object SkosConceptsRequest {
  case class SkosConceptsRequest(conceptUris: Seq[String])
  implicit val writes = Json.writes[SkosConceptsRequest]
  implicit val reads = Json.reads[SkosConceptsRequest]
}
