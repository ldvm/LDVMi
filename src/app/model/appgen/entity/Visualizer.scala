package model.appgen.entity

import model.entity.{ComponentTemplate, ComponentTemplateId, VisualizationConfiguration}
import play.api.libs.json.Json

object Visualizer {
  case class Visualizer(
    id: Option[ComponentTemplateId],
    uri: String,
    title: String,
    priority: Int,
    name: String,
    icon: String,
    disabled: Boolean,
    description: Option[String] = None,
    componentTemplateId: Option[ComponentTemplateId])

  implicit val visualizerWrites = Json.writes[Visualizer]

  def fromComponentTemplate(ct: ComponentTemplate, vc: VisualizationConfiguration) = {
    Visualizer(ct.id, ct.uri, ct.title, vc.priority, vc.appgenName, vc.appgenIcon, vc.appgenDisabled, ct.description, ct.id)
  }
}