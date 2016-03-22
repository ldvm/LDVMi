package views.appgen

import play.twirl.api.Html

object AppView {

  def get(visualizerTemplateUri: String): Option[Html] = {
    visualizerTemplateUri match {
      case "http://linked.opendata.cz/resource/ldvm/visualizer/gmaps/GoogleMapsVisualizerTemplate" => Some(views.html.appgen.googleMaps())
      case _ => None
    }
  }
}
