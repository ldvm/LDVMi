package model.appgen.service

import model.appgen.entity.Application
import model.appgen.entity.Visualizer._
import model.entity._
import CustomUnicornPlay.driver.simple._
import scaldi.{Injector, Injectable}
import play.api.db.slick.Session


class VisualizerService(implicit inj: Injector) extends Injectable {

  def getVisualizers(implicit session: Session): Seq[Visualizer] = (for {
      visualizerTemplate <- visualizerTemplatesQuery
      componentTemplate <- componentTemplatesQuery if componentTemplate.id === visualizerTemplate.componentTemplateId
      visualizationConfiguration <- visualizationConfigurationsQuery if componentTemplate.uri === visualizationConfiguration.visualizerUri
    } yield (componentTemplate, visualizationConfiguration)).list.map({
      case (ct: ComponentTemplate, vc: VisualizationConfiguration) => fromComponentTemplate(ct, vc)
    })

  def getVisualizer(application: Application)(implicit session: Session): Option[Visualizer] = {
    getVisualizers.find(_.componentTemplateId.get == application.visualizerComponentTemplateId)
  }
}
