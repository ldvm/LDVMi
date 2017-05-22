package controllers.api

import play.api.db.slick.DBAction
import scaldi.Injector

class TimeLineApiController(implicit inj: Injector) extends ApiController {
  override def createVisualisation(dataSourceTemplateId: Long, visualizer: String) = {
    if (supportedVisualizers.contains(visualizer)) {
      val visualizerUri = s"""http://linked.opendata.cz/resource/ldvm/visualizer/timeline-${visualizer}/TimeLineVisualizerTemplate"""
      super.createVisualisation(dataSourceTemplateId, visualizerUri)
    }
    else {
      DBAction { implicit rq => NotFound }
    }
  }

  private def supportedVisualizers: Seq[String] = Seq("instants", "intervals", "things-instants", "things-intervals", "things-things-instants", "things-things-intervals")
}