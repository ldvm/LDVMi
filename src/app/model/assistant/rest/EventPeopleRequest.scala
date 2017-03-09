package model.assistant.rest

import play.api.libs.json.Json

object EventPeopleRequest {
  case class EventPeopleRequest(event: String)
  implicit val writes = Json.writes[EventPeopleRequest]
  implicit val reads = Json.reads[EventPeopleRequest]
}
