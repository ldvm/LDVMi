package model.assistant.rest

import play.api.libs.json.Json

object UpdateVisualizerRequest{
  case class UpdateVisualizerRequest(
    visualizationUri: String,
    priority: Int,
    name: String,
    icon: String,
    disabled: Boolean
  )
  implicit val writes = Json.writes[UpdateVisualizerRequest]
  implicit val reads = Json.reads[UpdateVisualizerRequest]
}
