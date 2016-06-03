package model.appgen.rest

import play.api.libs.json.Json

object AddVisualizationConfigurationRequest {
  case class AddVisualizationConfigurationRequest(componentTemplateUri: String)
  implicit val writes = Json.writes[AddVisualizationConfigurationRequest]
  implicit val reads = Json.reads[AddVisualizationConfigurationRequest]
}
