package model.appgen.entity

import model.entity.{ComponentTemplate, ComponentTemplateId}
import play.api.libs.json.Json

object Visualizer {

  // Temporary class until the visualizers are actually represented in the database
  case class Visualizer(
    id: Option[ComponentTemplateId],
    uri: String,
    title: String,
    name: String,
    icon: String,
    supported: Boolean,
    description: Option[String] = None,
    componentTemplateId: Option[ComponentTemplateId])

  // TODO: ...why does the json write have to be here? Why doesn't it work in the package.scala file?
  implicit val visualizerWrites = Json.writes[Visualizer]

  def fromComponentTemplate(ct: ComponentTemplate) = {
    // Hard-coded icons
    val icon = ct.uri match {
      case "http://linked.opendata.cz/resource/ldvm/visualizer/gmaps/GoogleMapsVisualizerTemplate" => "map"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/data-cube/DataCubeVisualizerTemplate" => "insert_chart"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/concept/ConceptVisualizerTemplate" => "library_books"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/chord/ChordVisualizerTemplate" => "donut_large"
      case _ => "help"
    }

    // Hard-coded name
    val name = ct.uri match {
      case "http://linked.opendata.cz/resource/ldvm/visualizer/gmaps/GoogleMapsVisualizerTemplate" => "googleMaps"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/data-cube/DataCubeVisualizerTemplate" => "dataCube"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/concept/ConceptVisualizerTemplate" => "concepts"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/chord/ChordVisualizerTemplate" => "chord"
      case _ => "platform"
    }

    val supported = ct.uri match {
      case "http://linked.opendata.cz/resource/ldvm/visualizer/gmaps/GoogleMapsVisualizerTemplate" => true
      case "http://linked.opendata.cz/resource/ldvm/visualizer/chord/ChordVisualizerTemplate" => true
      case _ => false
    }

    Visualizer(ct.id, ct.uri, ct.title, name, icon, supported, ct.description, ct.id)
  }
}