package model.appgen.entity

import model.entity.{ComponentTemplate, ComponentTemplateId}
import play.api.libs.json.Json

object Visualizer {

  // Temporary class until the visualizers are actually represented in the database
  case class Visualizer(
    id: Option[ComponentTemplateId],
    uri: String,
    title: String,
    icon: String,
    description: Option[String] = None,
    componentTemplateId: Option[ComponentTemplateId])

  // TODO: ...why does the json write have to be here? Why doesn't it work in the package.scala file?
  implicit val visualizerWrites = Json.writes[Visualizer]

  def fromComponentTemplate(ct: ComponentTemplate) = {
    // Hard coded icons
    val icon = ct.uri match {
      case "http://linked.opendata.cz/resource/ldvm/visualizer/gmaps/GoogleMapsVisualizerTemplate" => "maps"
      case _ => "help"
    }
    Visualizer(ct.id, ct.uri, ct.title, icon, ct.description, ct.id)
  }
}