package model.appgen.rest

import play.api.libs.json.Json

object EmptyRequest {
  case class EmptyRequest(data: Option[String]) // The class has to have some parameters
  implicit val writes = Json.writes[EmptyRequest]
  implicit val reads = Json.reads[EmptyRequest]
}
