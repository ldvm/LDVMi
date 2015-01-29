package model.service.ldvm

import java.io.File

import model.entity._
import model.rdf.Graph
import model.service.ldvm.extractor.{ComponentExtractor, PipelineExtractor}
import model.service.{PipelineService, ComponentService, LdvmService}
import play.api.Play
import play.api.Play.current
import play.api.db.slick.{Session => SlickSession}
import scaldi.{Injectable, Injector}

class LdvmServiceImpl(implicit inj: Injector) extends LdvmService with Injectable {

  val componentExtractor = inject[ComponentExtractor]
  val pipelineExtractor = inject[PipelineExtractor]
  val pipelinesService = inject[PipelineService]
  val componentsService = inject[ComponentService]

  def fromRdf(ttlFile: File)(implicit session: SlickSession): (Option[Seq[ComponentTemplateId]], Option[Seq[PipelineId]]) = {

    val exploredGraph = createGraphWithLDVMVocabulary(ttlFile)

    val componentsByTypeOption = componentExtractor.extract(exploredGraph)
    val pipelinesOption = pipelineExtractor.extract(exploredGraph)

    val componentIdsOption = componentsByTypeOption.map(saveComponents)
    val pipelineIdsOption = pipelinesOption.map(pipelinesService.save)

    (componentIdsOption, pipelineIdsOption)
  }

  private def saveComponents(componentsByType: Map[String, Seq[model.dto.ComponentTemplate]])(implicit session: SlickSession): Seq[ComponentTemplateId] = {
    componentsByType.map { case (componentType, components) =>

      val ids = componentsService.save(components)

      componentType match {
        case "VisualizerTemplate" => ids.foreach(i => componentsService.saveVisualizer(VisualizerTemplate(None, i)))
        case "AnalyzerTemplate" => ids.foreach(i => componentsService.saveAnalyzer(AnalyzerTemplate(None, i)))
        case "DataSourceTemplate" => ids.foreach(i => componentsService.saveDataSource(DataSourceTemplate(None, i)))
        case "TransformerTemplate" => ids.foreach(i => componentsService.saveTransformer(TransformerTemplate(None, i)))
      }

      ids
    }.flatten.toSeq
  }

  private def createGraphWithLDVMVocabulary(ttlFile: File): Graph = {
    Graph(Play.getFile("public/ttl/ldvm/vocabulary.ttl")).get.union(Graph(ttlFile))
  }

}
