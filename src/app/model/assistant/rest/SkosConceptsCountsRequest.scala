package model.assistant.rest

import play.api.libs.json.Json

object SkosConceptsCountsRequest {
  case class SkosConceptsCountsRequest(propertyUri: String, conceptUris: Seq[String])
  implicit val writes = Json.writes[SkosConceptsCountsRequest]
  implicit val reads = Json.reads[SkosConceptsCountsRequest]
}
