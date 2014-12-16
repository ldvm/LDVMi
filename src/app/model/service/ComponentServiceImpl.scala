package model.service

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._
import model.repository._
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class ComponentServiceImpl(implicit inj: Injector) extends ComponentService with Injectable {

  protected val repository = inject[ComponentRepository]
  private val inputRepository = inject[InputRepository]
  private val outputRepository = inject[OutputRepository]
  private val dataPortRepository = inject[DataPortRepository]
  private val featureRepository = inject[FeatureRepository]
  private val featureToComponentRepository = inject[FeatureToComponentRepository]
  private val descriptorRepository = inject[DescriptorRepository]

  private val analyzerRepository = inject[AnalyzerRepository]
  private val visualizerRepository = inject[VisualizerRepository]
  private val transformerRepository = inject[TransformerRepository]
  private val dataSourceRepository = inject[DataSourceRepository]

  def save(component: model.dto.Component)(implicit session: Session): ComponentId = {

    val componentId = save(ComponentEntity(component))

    component.output.map { o =>
      saveOutput(componentId, o)
    }

    val inputIdsByUri = component.inputs.map { i =>
      (i.dataPort.uri, saveInput(componentId, i))
    }.toMap

    component.features.map { f =>
      saveFeature(f, inputIdsByUri, componentId)
    }

    componentId
  }

  private def saveInput(componentId: ComponentId, input: model.dto.Input)(implicit session: Session): InputId = {
    inputRepository.save(Input(
      None,
      saveDataPort(componentId, input.dataPort),
      componentId
    ))
  }

  private def saveDataPort(componentId: ComponentId, dataPort: model.dto.DataPort)(implicit session: Session): DataPortId = {
    dataPortRepository.save(DataPort(
      None,
      dataPort.uri,
      dataPort.title.getOrElse("Unlabeled data port"),
      dataPort.description,
      componentId
    ))
  }

  private def saveOutput(componentId: ComponentId, output: model.dto.Output)(implicit session: Session): OutputId = {
    outputRepository.save(Output(
      None,
      output.dataSample,
      saveDataPort(componentId, output.dataPort),
      componentId
    ))
  }

  private def saveFeature(feature: model.dto.Feature, inputIdsByUri: Map[String, InputId], componentId: ComponentId)(implicit session: Session): FeatureId = {
    val featureId = featureRepository.save(FeatureEntity(feature))

    feature.descriptors.foreach { descriptor =>
      saveDescriptor(descriptor, featureId, inputIdsByUri)
    }

    bindFeatureWithComponent(featureId, componentId)

    featureId
  }

  private def saveDescriptor(descriptor: model.dto.Descriptor, featureId: FeatureId, inputIdsByUri: Map[String, InputId])(implicit session: Session): DescriptorId = {
    descriptorRepository.save(DescriptorEntity(
      featureId,
      inputIdsByUri(descriptor.appliesTo.dataPort.uri),
      descriptor
    ))
  }

  private def bindFeatureWithComponent(featureId: FeatureId, componentId: ComponentId, ordering: Option[Int] = None)(implicit session: Session): FeatureToComponentId = {
    featureToComponentRepository.save(FeatureToComponent(None, componentId, featureId, ordering))
  }

  def saveAnalyzer(analyzer: Analyzer)(implicit session: Session): AnalyzerId = {
    analyzerRepository.save(analyzer)
  }

  def saveVisualizer(visualizer: Visualizer)(implicit session: Session): VisualizerId = {
    visualizerRepository.save(visualizer)
  }

  def saveTransformer(transformer: Transformer)(implicit session: Session): TransformerId = {
    transformerRepository.save(transformer)
  }

  def saveDataSource(dataSource: DataSource)(implicit session: Session): DataSourceId = {
    dataSourceRepository.save(dataSource)
  }

  def getByUri(uri: String)(implicit session: Session): Option[Component] = {
    componentsQuery.filter(_.uri === uri).firstOption
  }

  def getConcreteComponentByInstance(concreteInstance: model.dto.ConcreteComponentInstance)(implicit session: Session): Option[ConcreteComponent] = {

    concreteInstance match {
      case a: model.dto.AnalyzerInstance => getByInstance(a)
      case v: model.dto.VisualizerInstance => getByInstance(v)
      case t: model.dto.TransformerInstance => getByInstance(t)
      case d: model.dto.DataSourceInstance => getByInstance(d)
      case _ => throw new UnsupportedOperationException
    }
  }

  def getByInstance(analyzerInstance: model.dto.AnalyzerInstance)(implicit session: Session): Option[ConcreteComponent] = {
    (for {
      c <- componentsQuery.filter(_.uri === analyzerInstance.componentInstance.templateUri)
      a <- analyzersQuery.filter(_.componentId === c.id)
    } yield a).firstOption
  }

  def getByInstance(visualizerInstance: model.dto.VisualizerInstance)(implicit session: Session): Option[ConcreteComponent] = {
    (for {
      c <- componentsQuery.filter(_.uri === visualizerInstance.componentInstance.templateUri)
      v <- visualizersQuery.filter(_.componentId === c.id)
    } yield v).firstOption
  }

  def getByInstance(transformerInstance: model.dto.TransformerInstance)(implicit session: Session): Option[ConcreteComponent] = {
    (for {
      c <- componentsQuery.filter(_.uri === transformerInstance.componentInstance.templateUri)
      t <- transformersQuery.filter(_.componentId === c.id)
    } yield t).firstOption
  }

  def getByInstance(dataSourceInstance: model.dto.DataSourceInstance)(implicit session: Session): Option[ConcreteComponent] = {
    (for {
      c <- componentsQuery.filter(_.uri === dataSourceInstance.componentInstance.templateUri)
      ds <- dataSourcesQuery.filter(_.componentId === c.id)
    } yield ds).firstOption
  }

}