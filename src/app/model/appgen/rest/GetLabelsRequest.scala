package model.appgen.rest

import play.api.libs.json.Json

object GetLabelsRequest {
  case class GetLabelsRequest(resourceUris: Seq[String])
  implicit val writes = Json.writes[GetLabelsRequest]
  implicit val reads = Json.reads[GetLabelsRequest]
}
