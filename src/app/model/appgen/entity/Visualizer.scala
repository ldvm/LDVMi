package model.appgen.entity

import model.entity.{ComponentTemplate, ComponentTemplateId, VisualizationConfiguration, VisualizationConfigurationId}
import play.api.libs.json.Json

object Visualizer {
  case class Visualizer(
    id: Option[VisualizationConfigurationId],
    uri: String,
    title: String,
    visualizationUri: String = "",
    priority: Int,
    name: String,
    icon: String,
    disabled: Boolean,
    description: Option[String] = None,
    componentTemplateId: Option[ComponentTemplateId])

  implicit val visualizerWrites = Json.writes[Visualizer]

  def fromComponentTemplate(ct: ComponentTemplate, vc: VisualizationConfiguration) = {
    Visualizer(vc.id, ct.uri, ct.title, vc.visualizationUri, vc.priority, vc.appgenName, vc.appgenIcon, vc.appgenDisabled, ct.description, ct.id)
  }
}
