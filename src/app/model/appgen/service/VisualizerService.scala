package model.appgen.service

import model.appgen.entity.Visualizer._
import model.entity._
import CustomUnicornPlay.driver.simple._
import scaldi.{Injector, Injectable}
import play.api.db.slick.Session


class VisualizerService(implicit inj: Injector) extends Injectable {

  def getVisualizers(implicit session: Session): Seq[Visualizer] = (for {
      visualizerTemplate <- visualizerTemplatesQuery
      componentTemplate <- componentTemplatesQuery if componentTemplate.id === visualizerTemplate.componentTemplateId
    } yield componentTemplate).list.map(ct => fromComponentTemplate(ct))
}
