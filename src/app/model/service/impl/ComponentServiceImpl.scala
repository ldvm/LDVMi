package model.service.impl

import java.io.StringWriter

import model.dto.{BoundComponentInstances, ConcreteComponentInstance}
import model.entity.ComponentType.ComponentType
import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._
import model.repository._
import model.service.ComponentService
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class ComponentServiceImpl(implicit inj: Injector) extends ComponentService with Injectable {

  type DataPortInstanceUriMap[T] = Map[String, (T, DataPortInstanceId)]

  protected val repository = inject[ComponentTemplateRepository]
  protected val componentInstanceRepository = inject[ComponentInstanceRepository]
  private val inputTemplateRepository = inject[InputTemplateRepository]
  private val outputTemplateRepository = inject[OutputTemplateRepository]
  private val dataPortTemplateRepository = inject[DataPortTemplateRepository]
  private val featureRepository = inject[FeatureRepository]
  private val featureToComponentRepository = inject[FeatureToComponentRepository]
  private val descriptorRepository = inject[DescriptorRepository]

  private val analyzerTemplateRepository = inject[AnalyzerTemplateRepository]
  private val visualizerTemplateRepository = inject[VisualizerTemplateRepository]
  private val transformerTemplateRepository = inject[TransformerTemplateRepository]
  private val dataSourceTemplateRepository = inject[DataSourceTemplateRepository]
  private val dataPortInstancesRepository = inject[DataPortInstanceRepository]
  private val componentInstancesRepository = inject[ComponentInstanceRepository]
  private val analyzerInstancesRepository = inject[AnalyzerInstanceRepository]
  private val transformerInstancesRepository = inject[TransformerInstanceRepository]
  private val visualizerInstancesRepository = inject[VisualizerInstanceRepository]
  private val dataSourcesInstancesRepository = inject[DataSourceInstanceRepository]
  private val componentInstanceMembershipRepository = inject[ComponentInstanceMembershipRepository]

  private val inputRepository = inject[InputTemplateRepository]
  private val outputRepository = inject[OutputTemplateRepository]

  private val dataPortRepository = inject[DataPortTemplateRepository]
  private val dataPortBindingsRepository = inject[DataPortBindingRepository]
  private val nestedDataPortBindingsRepository = inject[NestedDataPortBindingRepository]
  private val dataPortBindingSetsRepository = inject[DataPortBindingSetRepository]

  private val inputInstancesRepository = inject[InputInstanceRepository]
  private val outputInstancesRepository = inject[OutputInstanceRepository]

  def getAllByType(implicit session: Session): Map[ComponentType, Seq[SpecificComponentTemplate]] = {
    Seq(
      (ComponentType.DataSource, dataSourceTemplateRepository.findAll()),
      (ComponentType.Analyzer, analyzerTemplateRepository.findAll()),
      (ComponentType.Transformer, transformerTemplateRepository.findAll()),
      (ComponentType.Visualizer, visualizerTemplateRepository.findAll())
    ).toMap
  }

  def save(componentTemplate: model.dto.ComponentTemplate)(implicit session: Session): ComponentTemplateId = {

    val maybeNestedResult = saveNestedMembers(componentTemplate.nestedMembers)
    val maybeNestedBindingSetId = maybeNestedResult.map(_._1)
    val componentTemplateId = save(ComponentEntity(componentTemplate, maybeNestedBindingSetId))

    val maybeOutputTemplateId = componentTemplate.outputTemplate.map { o =>
      (o.dataPort.uri, saveOutput(componentTemplateId, o))
    }

    val outputIdsByUri = maybeOutputTemplateId.toSeq

    val inputIdsByUri = componentTemplate.inputTemplates.map { i =>
      (i.dataPortTemplate.uri, saveInputTemplate(componentTemplateId, i))
    }.toMap

    val dataPortTemplateIdsByUri = inputIdsByUri ++ outputIdsByUri

    maybeNestedResult.map { case (nestedBindingSetId, nestedComponentIds) =>
      saveNestedBindings(
        nestedBindingSetId,
        BoundComponentInstances(componentTemplate.nestedMembers),
        nestedComponentIds,
        dataPortTemplateIdsByUri
      )
    }

    componentTemplate.features.map { f =>
      saveFeature(f, inputIdsByUri, componentTemplateId)
    }

    componentTemplateId
  }

  private def saveNestedMembers(members: Seq[ConcreteComponentInstance])(implicit session: Session): Option[(DataPortBindingSetId, Map[String, ComponentInstanceId])] = {
    if (members.isEmpty) {
      None
    } else {
      Some(saveMembers(BoundComponentInstances(members)))
    }
  }

  private def saveInputTemplate(componentTemplateId: ComponentTemplateId, input: model.dto.InputTemplate)(implicit session: Session): (DataPortTemplateId, InputTemplateId) = {
    val templateId = saveDataPortTemplate(componentTemplateId, input.dataPortTemplate)

    val specificId = inputTemplateRepository.save(InputTemplate(
      None,
      templateId,
      componentTemplateId
    ))

    (templateId, specificId)
  }

  private def saveOutput(componentTemplateId: ComponentTemplateId, outputTemplate: model.dto.OutputTemplate)(implicit session: Session): (DataPortTemplateId, OutputTemplateId) = {
    val templateId = saveDataPortTemplate(componentTemplateId, outputTemplate.dataPort)

    val specificId = outputTemplateRepository.save(OutputTemplate(
      None,
      outputTemplate.dataSample,
      templateId,
      componentTemplateId
    ))

    (templateId, specificId)
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

  private def saveFeature(feature: model.dto.Feature, inputIdsByUri: Map[String, (DataPortTemplateId, InputTemplateId)], componentId: ComponentTemplateId)(implicit session: Session): FeatureId = {
    val featureId = featureRepository.save(FeatureEntity(feature))

    feature.descriptors.foreach { descriptor =>
      saveDescriptor(descriptor, featureId, inputIdsByUri)
    }

    bindFeatureWithComponent(featureId, componentId)

    featureId
  }

  private def saveDescriptor(descriptor: model.dto.Descriptor, featureId: FeatureId, inputIdsByUri: Map[String, (DataPortTemplateId, InputTemplateId)])(implicit session: Session): DescriptorId = {
    descriptorRepository.save(DescriptorEntity(
      featureId,
      inputIdsByUri(descriptor.appliesTo.dataPortTemplate.uri)._2,
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

  def saveMembers(boundInstances: model.dto.BoundComponentInstances)(implicit session: Session): (DataPortBindingSetId, Map[String, ComponentInstanceId]) = {
    val instanceIdsByUri = saveComponentInstances(boundInstances.componentInstances)
    val inputInstancesByUri = saveInputInstances(boundInstances.inputInstancesWithComponentIds(instanceIdsByUri))
    val outputInstancesByUri = saveOutputInstances(boundInstances.outputInstancesWithComponentIds(instanceIdsByUri))
    val bindingSetId = saveBindings(boundInstances, inputInstancesByUri, outputInstancesByUri)

    saveMemberships(bindingSetId, instanceIdsByUri.values.toList)
    (bindingSetId, instanceIdsByUri)
  }

  private def saveMemberships(bindingSetId: DataPortBindingSetId, componentInstanceIds: Seq[ComponentInstanceId])(implicit session: Session) = {
    componentInstanceIds.map { componentInstanceId =>
      componentInstanceMembershipRepository.save(ComponentInstanceMembership(None, bindingSetId, componentInstanceId))
    }
  }

  private def saveComponentInstances(instances: Seq[model.dto.ConcreteComponentInstance])(implicit session: Session): Map[String, ComponentInstanceId] = {
    instances.flatMap { instance =>
      val concreteComponentOption = getConcreteComponentByInstance(instance)
      concreteComponentOption.map { concreteComponent =>

        val configString = instance.componentInstance.configuration.map { config =>
          val configWriter = new StringWriter()
          config.write(configWriter, "N3")
          configWriter.toString
        }

        val componentInstanceId = componentInstancesRepository.save(ComponentInstance(
          id = None,
          uri = instance.componentInstance.uri,
          title = instance.componentInstance.label.getOrElse("Unlabeled instance"),
          description = None,
          componentId = concreteComponent.componentTemplateId,
          configuration = configString
        ))

        concreteComponent match {
          case a: AnalyzerTemplate => analyzerInstancesRepository.save(AnalyzerInstance(None, componentInstanceId, a.id.get))
          case t: TransformerTemplate => transformerInstancesRepository.save(TransformerInstance(None, componentInstanceId, t.id.get))
          case v: VisualizerTemplate => visualizerInstancesRepository.save(VisualizerInstance(None, componentInstanceId, v.id.get))
          case d: DataSourceTemplate => dataSourcesInstancesRepository.save(DataSourceInstance(None, componentInstanceId, d.id.get))
          case _ => throw new UnsupportedOperationException
        }

        (instance.componentInstance.uri, componentInstanceId)
      }
    }.toMap
  }

  private def saveInputInstances(inputInstancesByComponentId: Seq[(ComponentInstanceId, Seq[model.dto.InputInstance])])(implicit session: Session): DataPortInstanceUriMap[InputInstanceId] = {

    inputInstancesByComponentId.map { case (componentInstanceId, inputInstances) =>
      inputInstances.map { inputInstance =>

        val dataPort = dataPortRepository.findByUri(inputInstance.templateUri).get
        val input = inputRepository.findByDataPort(dataPort).get

        val dataPortInstanceId = dataPortInstancesRepository.save(DataPortInstance(
          id = None,
          uri = inputInstance.uri,
          title = "Unlabeled input instance",
          description = None,
          componentInstanceId = componentInstanceId,
          dataPortTemplateId = dataPort.id.get
        ))

        val inputInstanceId = inputInstancesRepository.save(InputInstance(
          id = None,
          dataPortInstanceId = dataPortInstanceId,
          inputTemplateId = input.id.get,
          componentInstanceId = componentInstanceId
        ))

        (inputInstance.uri, (inputInstanceId, dataPortInstanceId))
      }
    }.flatten.toMap
  }

  private def saveOutputInstances(outputInstancesByComponentId: Seq[(ComponentInstanceId, model.dto.OutputInstance)])(implicit session: Session): DataPortInstanceUriMap[OutputInstanceId] = {

    outputInstancesByComponentId.map { case (componentInstanceId, outputInstance) =>

      val dataPort = dataPortRepository.findByUri(outputInstance.templateUri).get
      val output = outputRepository.findByDataPort(dataPort).get

      val dataPortInstanceId = dataPortInstancesRepository.save(DataPortInstance(
        id = None,
        uri = outputInstance.uri,
        title = "Unlabeled input instance",
        description = None,
        componentInstanceId = componentInstanceId,
        dataPortTemplateId = dataPort.id.get
      ))

      val outputInstanceId = outputInstancesRepository.save(OutputInstance(
        id = None,
        dataPortInstanceId = dataPortInstanceId,
        outputId = output.id.get,
        componentInstanceId = componentInstanceId
      ))

      (outputInstance.uri, (outputInstanceId, dataPortInstanceId))
    }.toMap
  }

  private def saveNestedBindings(
    bindingSetId: DataPortBindingSetId,
    boundInstances: BoundComponentInstances,
    instanceIdsByUri: Map[String, ComponentInstanceId],
    nestedCounterpartsByUri: Map[String, (DataPortTemplateId, _)] = Map()
  )(implicit session: Session) = {

    val inputInstancesByUri = saveInputInstances(boundInstances.inputInstancesWithComponentIds(instanceIdsByUri))
    val outputInstancesByUri = saveOutputInstances(boundInstances.outputInstancesWithComponentIds(instanceIdsByUri))

    val inputInstances = boundInstances.componentInstances.flatMap(_.componentInstance.inputInstances)
    inputInstances.map { inputInstance =>
      val inputInstanceId = inputInstancesByUri(inputInstance.uri)._2

      val nestedBoundUris = inputInstance.nestedBoundTo
      nestedBoundUris.map { nestedCounterpartUri =>
        nestedCounterpartsByUri.get(nestedCounterpartUri).map { nestedCounterPartId =>
          nestedDataPortBindingsRepository.save(
            NestedDataPortBinding(
              None,
              bindingSetId,
              sourcePortTemplateId = Some(nestedCounterPartId._1),
              targetPortInstanceId = Some(inputInstanceId)
            )
          )
        }
      }
    }

    val outputInstances = boundInstances.componentInstances.flatMap(_.componentInstance.outputInstance)
    outputInstances.map { outputInstance =>
      val outputInstanceId = outputInstancesByUri(outputInstance.uri)._2

      val nestedBoundUris = outputInstance.nestedBoundTo
      nestedBoundUris.map { nestedCounterpartUri =>
        nestedCounterpartsByUri.get(nestedCounterpartUri).map { nestedCounterPartId =>
          nestedDataPortBindingsRepository.save(
            NestedDataPortBinding(
              None,
              bindingSetId,
              targetPortTemplateId = Some(nestedCounterPartId._1),
              sourcePortInstanceId = Some(outputInstanceId)
            )
          )
        }
      }
    }

  }

  private def saveBindings(
    pipeline: model.dto.BoundComponentInstances,
    inputInstancesByUri: DataPortInstanceUriMap[InputInstanceId],
    outputInstancesByUri: DataPortInstanceUriMap[OutputInstanceId]
  )
    (implicit session: Session)
  : DataPortBindingSetId = {

    val inputPorts = inputInstancesByUri.map { case (key, (_, portId)) => (key, portId)}
    val outputPorts = outputInstancesByUri.map { case (key, (_, portId)) => (key, portId)}

    val ports = (inputPorts ++ outputPorts).toMap

    val bindingSetId = dataPortBindingSetsRepository.save(DataPortBindingSet(None))

    val inputInstances = pipeline.componentInstances.flatMap(_.componentInstance.inputInstances)
    inputInstances.map { inputInstance =>
      val inputInstanceId = inputInstancesByUri(inputInstance.uri)._2
      val sourceUris = inputInstance.boundTo

      sourceUris.map { sourceUri =>
        ports.get(sourceUri).map { sourceId =>
          dataPortBindingsRepository.save(DataPortBinding(None, bindingSetId, sourceId, inputInstanceId))
        }
      }
    }

    bindingSetId
  }

}