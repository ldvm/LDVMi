package model.service.impl

import model.dto.{BoundComponentInstances, ConcreteComponentInstance}
import model.entity.ComponentType.ComponentType
import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._
import model.repository._
import model.service.{ComponentInstanceService, ComponentTemplateService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class ComponentTemplateServiceImpl(implicit inj: Injector) extends ComponentTemplateService with Injectable {

  protected val repository = inject[ComponentTemplateRepository]
  private val inputTemplateRepository = inject[InputTemplateRepository]
  private val outputTemplateRepository = inject[OutputTemplateRepository]
  private val dataPortTemplateRepository = inject[DataPortTemplateRepository]
  private val featureRepository = inject[FeatureRepository]
  private val featureToComponentRepository = inject[FeatureToComponentRepository]
  private val descriptorRepository = inject[DescriptorRepository]
  private val componentInstanceService = inject[ComponentInstanceService]

  private val analyzerTemplateRepository = inject[AnalyzerTemplateRepository]
  private val visualizerTemplateRepository = inject[VisualizerTemplateRepository]
  private val transformerTemplateRepository = inject[TransformerTemplateRepository]
  private val dataSourceTemplateRepository = inject[DataSourceTemplateRepository]

  def getAllByType(implicit session: Session): Map[ComponentType, Seq[SpecificComponentTemplate]] = {
    Seq(
      (ComponentType.DataSource, dataSourceTemplateRepository.findAll()),
      (ComponentType.Analyzer, analyzerTemplateRepository.findAll()),
      (ComponentType.Transformer, transformerTemplateRepository.findAll()),
      (ComponentType.Visualizer, visualizerTemplateRepository.findAll())
    ).toMap
  }

  def save(componentTemplate: model.dto.ComponentTemplate)(implicit session: Session): ComponentTemplateId = {

    val maybeNestedBindingSetId = saveNestedMembers(componentTemplate.nestedMembers)

    val componentTemplateId = save(ComponentEntity(componentTemplate, maybeNestedBindingSetId))

    componentTemplate.outputTemplate.map { o =>
      saveOutput(componentTemplateId, o)
    }

    val inputIdsByUri = componentTemplate.inputTemplates.map { i =>
      (i.dataPortTemplate.uri, saveInputTemplate(componentTemplateId, i))
    }.toMap

    componentTemplate.features.map { f =>
      saveFeature(f, inputIdsByUri, componentTemplateId)
    }

    componentTemplateId
  }

  private def saveNestedMembers(members: Seq[ConcreteComponentInstance])(implicit session: Session): Option[DataPortBindingSetId] = {
    if (members.isEmpty) {
      None
    } else {
      Some(componentInstanceService.saveMembers(BoundComponentInstances(members)))
    }
  }

  private def saveInputTemplate(componentTemplateId: ComponentTemplateId, input: model.dto.InputTemplate)(implicit session: Session): InputTemplateId = {
    inputTemplateRepository.save(InputTemplate(
      None,
      saveDataPortTemplate(componentTemplateId, input.dataPortTemplate),

      componentTemplateId
    ))
  }

  private def saveDataPortTemplate(componentTemplateId: ComponentTemplateId, dataPortTemplate: model.dto.DataPortTemplate)(implicit session: Session): DataPortTemplateId = {
    dataPortTemplateRepository.save(DataPortTemplate(
      None,
      dataPortTemplate.uri,
      dataPortTemplate.title.getOrElse("Unlabeled data port"),
      dataPortTemplate.description,
      componentTemplateId
    ))
  }

  private def saveOutput(componentTemplateId: ComponentTemplateId, outputTemplate: model.dto.OutputTemplate)(implicit session: Session): OutputId = {
    outputTemplateRepository.save(OutputTemplate(
      None,
      outputTemplate.dataSample,
      saveDataPortTemplate(componentTemplateId, outputTemplate.dataPort),
      componentTemplateId
    ))
  }

  private def saveFeature(feature: model.dto.Feature, inputIdsByUri: Map[String, InputTemplateId], componentId: ComponentTemplateId)(implicit session: Session): FeatureId = {
    val featureId = featureRepository.save(FeatureEntity(feature))

    feature.descriptors.foreach { descriptor =>
      saveDescriptor(descriptor, featureId, inputIdsByUri)
    }

    bindFeatureWithComponent(featureId, componentId)

    featureId
  }

  private def saveDescriptor(descriptor: model.dto.Descriptor, featureId: FeatureId, inputIdsByUri: Map[String, InputTemplateId])(implicit session: Session): DescriptorId = {
    descriptorRepository.save(DescriptorEntity(
      featureId,
      inputIdsByUri(descriptor.appliesTo.dataPortTemplate.uri),
      descriptor
    ))
  }

  private def bindFeatureWithComponent(featureId: FeatureId, componentId: ComponentTemplateId, ordering: Option[Int] = None)(implicit session: Session): FeatureToComponentId = {
    featureToComponentRepository.save(FeatureToComponent(None, componentId, featureId, ordering))
  }

  def saveAnalyzer(analyzer: AnalyzerTemplate)(implicit session: Session): AnalyzerTemplateId = {
    analyzerTemplateRepository.save(analyzer)
  }

  def saveVisualizer(visualizer: VisualizerTemplate)(implicit session: Session): VisualizerTemplateId = {
    visualizerTemplateRepository.save(visualizer)
  }

  def saveTransformer(transformer: TransformerTemplate)(implicit session: Session): TransformerTemplateId = {
    transformerTemplateRepository.save(transformer)
  }

  def saveDataSource(dataSource: DataSourceTemplate)(implicit session: Session): DataSourceTemplateId = {
    dataSourceTemplateRepository.save(dataSource)
  }

  def getByUri(uri: String)(implicit session: Session): Option[ComponentTemplate] = {
    componentTemplatesQuery.filter(_.uri === uri).firstOption
  }

  def getConcreteComponentByInstance(concreteInstance: model.dto.ConcreteComponentInstance)(implicit session: Session): Option[SpecificComponentTemplate] = {

    concreteInstance match {
      case a: model.dto.AnalyzerInstance => getByInstance(a)
      case v: model.dto.VisualizerInstance => getByInstance(v)
      case t: model.dto.TransformerInstance => getByInstance(t)
      case d: model.dto.DataSourceInstance => getByInstance(d)
      case _ => throw new UnsupportedOperationException
    }
  }

  def getByInstance(analyzerInstance: model.dto.AnalyzerInstance)(implicit session: Session): Option[SpecificComponentTemplate] = {
    (for {
      c <- componentTemplatesQuery.filter(_.uri === analyzerInstance.componentInstance.templateUri)
      a <- analyzerTemplatesQuery.filter(_.componentId === c.id)
    } yield a).firstOption
  }

  def getByInstance(visualizerInstance: model.dto.VisualizerInstance)(implicit session: Session): Option[SpecificComponentTemplate] = {
    (for {
      c <- componentTemplatesQuery.filter(_.uri === visualizerInstance.componentInstance.templateUri)
      v <- visualizerTemplatesQuery.filter(_.componentId === c.id)
    } yield v).firstOption
  }

  def getByInstance(transformerInstance: model.dto.TransformerInstance)(implicit session: Session): Option[SpecificComponentTemplate] = {
    (for {
      c <- componentTemplatesQuery.filter(_.uri === transformerInstance.componentInstance.templateUri)
      t <- transformerTemplatesQuery.filter(_.componentTemplateId === c.id)
    } yield t).firstOption
  }

  def getByInstance(dataSourceInstance: model.dto.DataSourceInstance)(implicit session: Session): Option[SpecificComponentTemplate] = {
    (for {
      c <- componentTemplatesQuery.filter(_.uri === dataSourceInstance.componentInstance.templateUri)
      ds <- dataSourceTemplatesQuery.filter(_.componentTemplateId === c.id)
    } yield ds).firstOption
  }

}