package model.assistant.rest

import java.util.Date
import play.api.libs.json.Json

object EventRequest {
  case class EventRequest(start: Date, end: Date, limit: Int)
  implicit val writes = Json.writes[EventRequest]
  implicit val reads = Json.reads[EventRequest]
}
