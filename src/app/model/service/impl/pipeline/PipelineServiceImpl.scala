package model.service.impl.pipeline

import java.io.StringWriter

import akka.actor.ActorRef
import model.entity._
import model.repository._
import model.service._
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class PipelineServiceImpl(implicit inj: Injector) extends PipelineService with Injectable with Connected {

  type DataPortUriMap[T] = Map[String, (T, DataPortInstanceId)]

  val repository = inject[PipelineRepository]
  val dataPortInstancesRepository = inject[DataPortInstanceRepository]
  val componentInstancesRepository = inject[ComponentInstanceRepository]
  val analyzerInstancesRepository = inject[AnalyzerInstanceRepository]
  val transformerInstancesRepository = inject[TransformerInstanceRepository]
  val visualizerInstancesRepository = inject[VisualizerInstanceRepository]
  val dataSourcesInstancesRepository = inject[DataSourceInstanceRepository]
  val componentInstanceMembershipRepository = inject[ComponentInstanceMembershipRepository]
  val componentRepository = inject[ComponentTemplateRepository]

  val inputRepository = inject[InputTemplateRepository]
  val outputRepository = inject[OutputTemplateRepository]
  val pipelineDiscoveryRepository = inject[PipelineDiscoveryRepository]
  val pipelinesRepository = inject[PipelineRepository]

  val dataPortRepository = inject[DataPortTemplateRepository]
  val dataPortBindingsRepository = inject[DataPortBindingRepository]
  val dataPortBindingSetsRepository = inject[DataPortBindingSetRepository]

  val inputInstancesRepository = inject[InputInstanceRepository]
  val outputInstancesRepository = inject[OutputInstanceRepository]

  val componentService = inject[ComponentTemplateService]
  val compatibilityService = inject[CompatibilityService]

  def save(pipeline: model.dto.Pipeline)(implicit session: Session): PipelineId = {

    val instanceIdsByUri = saveComponentInstances(pipeline.componentInstances)
    val inputInstancesByUri = saveInputInstances(pipeline.inputInstancesWithComponentIds(instanceIdsByUri))
    val outputInstancesByUri = saveOutputInstances(pipeline.outputInstancesWithComponentIds(instanceIdsByUri))
    val bindingSetId = saveBindings(pipeline, inputInstancesByUri, outputInstancesByUri)

    saveMemberships(bindingSetId, instanceIdsByUri.values.toList)

    save(Pipeline(
      None,
      bindingSetId,
      pipeline.uri,
      pipeline.title.getOrElse("Unlabeled pipeline"),
      None,
      false,
      None
    ))
  }

  private def saveMemberships(bindingSetId: DataPortBindingSetId, componentInstanceIds: Seq[ComponentInstanceId])(implicit session: Session) = {
    componentInstanceIds.map { componentInstanceId =>
      componentInstanceMembershipRepository.save(ComponentInstanceMembership(None, bindingSetId, componentInstanceId))
    }
  }

  private def saveComponentInstances(instances: Seq[model.dto.ConcreteComponentInstance])(implicit session: Session): Map[String, ComponentInstanceId] = {
    instances.flatMap { instance =>
      val concreteComponentOption = componentService.getConcreteComponentByInstance(instance)
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

  private def saveInputInstances(inputInstancesByComponentId: Seq[(ComponentInstanceId, Seq[model.dto.InputInstance])])(implicit session: Session): DataPortUriMap[InputInstanceId] = {

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
          dataPortId = dataPort.id.get
        ))

        val inputInstanceId = inputInstancesRepository.save(InputInstance(
          id = None,
          dataPortInstanceId = dataPortInstanceId,
          inputId = input.id.get,
          componentInstanceId = componentInstanceId
        ))

        (inputInstance.uri, (inputInstanceId, dataPortInstanceId))
      }
    }.flatten.toMap
  }

  private def saveOutputInstances(outputInstancesByComponentId: Seq[(ComponentInstanceId, model.dto.OutputInstance)])(implicit session: Session): DataPortUriMap[OutputInstanceId] = {

    outputInstancesByComponentId.map { case (componentInstanceId, outputInstance) =>

      val dataPort = dataPortRepository.findByUri(outputInstance.templateUri).get
      val output = outputRepository.findByDataPort(dataPort).get

      val dataPortInstanceId = dataPortInstancesRepository.save(DataPortInstance(
        id = None,
        uri = outputInstance.uri,
        title = "Unlabeled input instance",
        description = None,
        componentInstanceId = componentInstanceId,
        dataPortId = dataPort.id.get
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

  private def saveBindings(pipeline: model.dto.Pipeline, inputInstancesByUri: DataPortUriMap[InputInstanceId], outputInstancesByUri: DataPortUriMap[OutputInstanceId])
    (implicit session: Session)
  : DataPortBindingSetId = {

    val inputSources = inputInstancesByUri.map { case (key, (_, portId)) => (key, portId)}
    val outputSources = outputInstancesByUri.map { case (key, (_, portId)) => (key, portId)}

    val sources = (inputSources ++ outputSources).toMap

    val bindingSetId = dataPortBindingSetsRepository.save(DataPortBindingSet(None))

    val inputInstances = pipeline.componentInstances.flatMap(_.componentInstance.inputInstances)
    inputInstances.map { inputInstance =>
      val uri = inputInstance.uri
      val sourceUri = inputInstance.boundTo

      sources.get(sourceUri).map { sourceId =>
        dataPortBindingsRepository.save(DataPortBinding(None, bindingSetId, sourceId, inputInstancesByUri(uri)._1))
      }
    }

    bindingSetId
  }

  def discoveryState(pipelineDiscoveryId: PipelineDiscoveryId)(implicit session: Session): Option[PipelineDiscovery] = {
    pipelineDiscoveryRepository.findById(pipelineDiscoveryId)
  }

  private def createInstance(componentInstance: ComponentInstance)(implicit session: Session) : (ComponentInstanceId, Map[String, InputInstanceId], Option[DataPortInstanceId]) = {
    val componentInstanceId = componentInstancesRepository.save(componentInstance)
    val inputIdsByUri = componentInstance.componentTemplate.inputTemplates.map { it =>
      val portTemplate = it.dataPortTemplate
      val portInstance = DataPortInstance(None, portTemplate.uri+"#instance", portTemplate.title, None, componentInstanceId, portTemplate.id.get)
      val portInstanceId = dataPortInstancesRepository.save(portInstance)
      val inputInstance = InputInstance(None, portInstanceId, it.id.get, componentInstanceId)
      (portTemplate.uri, inputInstancesRepository.save(inputInstance))
    }.toMap

    val maybeOutputId = componentInstance.componentTemplate.outputTemplate.map { ot =>
      val portTemplate = ot.dataPortTemplate
      val portInstance = DataPortInstance(None, portTemplate.uri+"#instance", portTemplate.title, None, componentInstanceId, portTemplate.id.get)
      val portInstanceId = dataPortInstancesRepository.save(portInstance)
      val outputInstance = OutputInstance(None, portInstanceId, ot.id.get, componentInstanceId)
      outputInstancesRepository.save(outputInstance)
      portInstanceId
    }

    (componentInstanceId, inputIdsByUri, maybeOutputId)
  }

  def saveDiscoveryResults(pipelineDiscoveryId: PipelineDiscoveryId, pipelines: Seq[PartialPipeline]) = {
    withSession { implicit session =>
      pipelines.map { pipeline =>

        val bindingSet = DataPortBindingSet(None)
        val bindingSetId = dataPortBindingSetsRepository.save(bindingSet)

        val instanceData = pipeline.componentInstances.map { componentInstance =>
          val result = createInstance(componentInstance)
          componentInstanceMembershipRepository.save(ComponentInstanceMembership(None, bindingSetId, result._1))
          (componentInstance, result)
        }.toMap

        val pipelineId = pipelinesRepository.save(Pipeline(None, bindingSetId, "", "Generated pipeline", None, isTemporary = true, pipelineDiscovery = Some(pipelineDiscoveryId)))

        pipeline.portMappings.map { mapping =>
          val sourceId = instanceData(mapping.sourceComponentInstance)._3.get
          val targetId = instanceData(mapping.targetComponentInstance)._2(mapping.viaPortUri)
          val binding = DataPortBinding(None, bindingSetId, sourceId, targetId)
          dataPortBindingsRepository.save(binding)
        }

        compatibilityService.check(bindingSet)
      }
    }
  }

  def discover(listener: ActorRef)(implicit session: Session): PipelineDiscoveryId = {
    val allComponentsByType = componentService.getAllByType
    new PipelineDiscoveryAlgorithm(allComponentsByType, listener)
      .runWith(
        allComponentsByType(ComponentType.DataSource).collect { case d: DataSourceTemplate => d }
      )
  }

}