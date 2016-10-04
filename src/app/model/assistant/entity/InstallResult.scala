package model.assistant.entity

import model.entity.{ComponentTemplate, ComponentTemplateId, VisualizationConfiguration, VisualizationConfigurationId}
import play.api.libs.json.Json

object InstallResult {
  case class InstallResult(success: Boolean, message: String)

  implicit val installResultWrites = Json.writes[InstallResult]

  def success(message: String) = InstallResult(success = true, message)
  def failure(message: String) = InstallResult(success = false, message)
}
