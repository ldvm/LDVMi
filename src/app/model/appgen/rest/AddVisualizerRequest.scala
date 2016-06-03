package model.appgen.rest

import play.api.libs.json.Json

object AddVisualizerRequest{
  case class AddVisualizerRequest(componentTemplateUri: String)
  implicit val writes = Json.writes[AddVisualizerRequest]
  implicit val reads = Json.reads[AddVisualizerRequest]
}
