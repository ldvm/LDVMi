package model.appgen.service

import model.appgen.entity.Application
import model.appgen.entity.Visualizer._
import model.entity._
import CustomUnicornPlay.driver.simple._
import model.appgen.rest.UpdateVisualizerRequest.UpdateVisualizerRequest
import model.repository.VisualizationConfigurationRepository
import scaldi.{Injectable, Injector}
import play.api.db.slick.Session

import scala.util.Try

/**
  * There is no single "visualizer" entity. We're combining the LDVM visualizer components
  * with "visualization_configuration" table that contains user-editable meta-data. We
  * don't expect large amounts of data here, so we just fetch all related data and then
  * we let Scala do all the merging and filtering.
  */
class VisualizerService(implicit inj: Injector) extends Injectable {
  val visualizationConfigurationRepository = inject[VisualizationConfigurationRepository]

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

  def getVisualizer(component: ComponentTemplate)(implicit session: Session): Option[Visualizer] = {
    getVisualizers.find(_.componentTemplateId == component.id)
  }

  def getVisualizer(id: VisualizationConfigurationId)(implicit session: Session): Option[Visualizer] = {
    getVisualizers.find(_.id.get == id)
  }

  def getVisualizerComponents(implicit session: Session): Seq[ComponentTemplate] = (for {
    visualizerTemplate <- visualizerTemplatesQuery
    componentTemplate <- componentTemplatesQuery if componentTemplate.id === visualizerTemplate.componentTemplateId
  } yield componentTemplate).list

  def addVisualizer(component: ComponentTemplate)(implicit session: Session): Try[Visualizer] = {
    val configuration = new VisualizationConfiguration(None, component.uri)
    Try(visualizationConfigurationRepository save configuration)
      .map({ _ => getVisualizer(component).head })
  }

  def deleteVisualizer(visualizer: Visualizer)(implicit session: Session) = {
    visualizationConfigurationRepository.deleteById(visualizer.id.get)
  }

  def updateVisualizer(visualizer: Visualizer, request: UpdateVisualizerRequest)(implicit session: Session) = {
    visualizationConfigurationRepository
      .findById(visualizer.id.get)
      .map { configuration => configuration.copy(
        visualizationUri = request.visualizationUri,
        priority = request.priority,
        appgenName = request.name,
        appgenIcon = request.icon,
        appgenDisabled = request.disabled)
      }
      .map(visualizationConfigurationRepository.save)
  }
}
