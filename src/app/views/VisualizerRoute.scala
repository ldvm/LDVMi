package views

import model.entity.PipelineEvaluationId

object VisualizerRoute {

  def route(visualizerTemplateUri: String, evaluationId: PipelineEvaluationId): String = {

    val pattern = visualizerTemplateUri match {
      case "http://linked.opendata.cz/resource/ldvm/visualizer/treemap/TreemapVisualizerTemplate" => "/visualize#/hierarchy/treemap/%ei"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/concept/ConceptVisualizerTemplate" => "/visualize#/hierarchy/treemap/%ei"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/sunburst/SunburstVisualizerTemplate" => "/visualize#/hierarchy/sunburst/%ei"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/gmaps/PolygonMapsVisualizerTemplate" => "/visualize/map#/id/%ei"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/gmaps/GoogleMapsVisualizerTemplate" => "/visualize/map#/markers/%ei"
      case "http://linked.opendata.cz/ontology/ldvm/visualizer/data-cube/DataCubeVisualizerTemplate" => "/visualize/datacube#/id/%ei"
      case "http://linked.opendata.cz/resource/ldvm/visualizer/openlayers/OpenLayersVisualizerTemplate" => "/visualize/openlayers#/id/%ei"
      case _ => "/404"
    }

    pattern.replace("%ei", evaluationId.id.toString)

  }
}
