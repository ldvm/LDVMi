package model.service.impl

import java.io.StringWriter

import model.entity._
import model.repository._
import model.service.component.{InternalComponent, InternalComponent$}
import model.service.{ComponentTemplateService, PipelineService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class PipelineServiceImpl(implicit inj: Injector) extends PipelineService with Injectable {

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

  val dataPortRepository = inject[DataPortTemplateRepository]
  val dataPortBindingsRepository = inject[DataPortBindingRepository]
  val dataPortBindingSetsRepository = inject[DataPortBindingSetRepository]

  val inputInstancesRepository = inject[InputInstanceRepository]
  val outputInstancesRepository = inject[OutputInstanceRepository]

  val componentService = inject[ComponentTemplateService]

  def save(pipeline: model.dto.Pipeline)(implicit session: Session): PipelineId = {

    val instanceIdsByUri = saveComponentInstances(pipeline.componentInstances)

    val inputInstancesWithComponentIds = pipeline.componentInstances.map { componentInstance =>
      instanceIdsByUri.get(componentInstance.componentInstance.uri).map { componentInstanceId =>
        (componentInstanceId, componentInstance.componentInstance.inputInstances)
      }
    }.filter(_.isDefined).map(_.get)

    val outputInstancesWithComponentIds = pipeline.componentInstances.map { componentInstance =>
      instanceIdsByUri.get(componentInstance.componentInstance.uri).map { componentInstanceId =>
        (componentInstanceId, componentInstance.componentInstance.outputInstance)
      }
    }.map {
      case None => None
      case Some((_, None)) => None
      case Some((cid, Some(oi))) => Some((cid, oi))
    }.filter(_.isDefined).map(_.get)

    val inputInstancesByUri = saveInputInstances(inputInstancesWithComponentIds)
    val outputInstancesByUri = saveOutputInstances(outputInstancesWithComponentIds)

    val bindingSetId = saveBindings(pipeline, inputInstancesByUri, outputInstancesByUri)

    saveMemberships(bindingSetId, instanceIdsByUri.values.toList)

    save(Pipeline(
      None,
      bindingSetId,
      pipeline.uri,
      pipeline.title.getOrElse("Unlabeled pipeline"),
      None
    ))
  }

  private def saveMemberships(bindingSetId: DataPortBindingSetId, componentInstanceIds: Seq[ComponentInstanceId])(implicit session: Session) = {
    componentInstanceIds.map { componentInstanceId =>
      componentInstanceMembershipRepository.save(ComponentInstanceMembership(None, bindingSetId, componentInstanceId))
    }
  }

  private def saveComponentInstances(instances: Seq[model.dto.ConcreteComponentInstance])(implicit session: Session): Map[String, ComponentInstanceId] = {
    instances.map { instance =>
      val concreteComponentOption = componentService.getConcreteComponentByInstance(instance)
      concreteComponentOption.map { concreteComponent =>

        val configString = instance.componentInstance.configuration.map { config =>
          val configWriter = new StringWriter()
          config.write(configWriter, "N3")
          configWriter.toString
        }

        val componentInstanceId = componentInstancesRepository.save(ComponentInstance(
          None,
          instance.componentInstance.uri,
          instance.componentInstance.label.getOrElse("Unlabeled instance"),
          None,
          concreteComponent.componentTemplateId,
          configString
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
    }.filter(_.isDefined).map(_.get).toMap
  }

  private def saveInputInstances(inputInstancesByComponentId: Seq[(ComponentInstanceId, Seq[model.dto.InputInstance])])(implicit session: Session): DataPortUriMap[InputInstanceId] = {

    inputInstancesByComponentId.map { case (componentInstanceId, inputInstances) =>
      inputInstances.map { inputInstance =>

        val dataPort = dataPortRepository.findByUri(inputInstance.templateUri).get
        val input = inputRepository.findByDataPort(dataPort).get

        val dataPortInstanceId = dataPortInstancesRepository.save(DataPortInstance(
          None,
          inputInstance.uri,
          "Unlabeled input instance",
          None,
          componentInstanceId,
          dataPort.id.get
        ))

        val id = inputInstancesRepository.save(InputInstance(
          None,
          dataPortInstanceId,
          input.id.get,
          componentInstanceId
        ))

        (inputInstance.uri, (id, dataPortInstanceId))
      }
    }.flatten.toMap
  }

  private def saveOutputInstances(outputInstancesByComponentId: Seq[(ComponentInstanceId, model.dto.OutputInstance)])(implicit session: Session): DataPortUriMap[OutputInstanceId] = {

    outputInstancesByComponentId.map { case (componentInstanceId, outputInstance) =>

      val dataPort = dataPortRepository.findByUri(outputInstance.templateUri).get
      val output = outputRepository.findByDataPort(dataPort).get

      val dataPortInstanceId = dataPortInstancesRepository.save(DataPortInstance(
        None,
        outputInstance.uri,
        "Unlabeled input instance",
        None,
        componentInstanceId,
        dataPort.id.get
      ))

      val id = outputInstancesRepository.save(OutputInstance(
        None,
        dataPortInstanceId,
        output.id.get,
        componentInstanceId
      ))

      (outputInstance.uri, (id, dataPortInstanceId))
    }.toMap
  }

  private def saveBindings(pipeline: model.dto.Pipeline, inputInstancesByUri: DataPortUriMap[InputInstanceId], outputInstancesByUri: DataPortUriMap[OutputInstanceId])(implicit session: Session): DataPortBindingSetId = {

    val inputSources = inputInstancesByUri.map { p => (p._1, p._2._2)}
    val outputSources = outputInstancesByUri.map { p => (p._1, p._2._2)}

    val sources = (inputSources ++ outputSources).toMap

    val bindingSetId = dataPortBindingSetsRepository.save(DataPortBindingSet(None))

    val inputInstances = pipeline.componentInstances.map(_.componentInstance.inputInstances).flatten
    inputInstances.map { inputInstance =>
      val uri = inputInstance.uri
      val sourceUri = inputInstance.boundTo

      sources.get(sourceUri).map { sourceId =>
        dataPortBindingsRepository.save(DataPortBinding(None, bindingSetId, sourceId, inputInstancesByUri(uri)._1))
      }
    }

    bindingSetId
  }

  def construct(implicit session: Session): Seq[PartialPipeline] = {

    val allComponents = componentService.getAllByType

    def nextRound(partialPipelines: Seq[PartialPipeline]): Seq[PartialPipeline] = {
      Seq(ComponentType.Analyzer, ComponentType.Transformer, ComponentType.Visualizer).flatMap { componentType =>
        allComponents(componentType).flatMap { component =>
          tryAdd(component, partialPipelines)
        }
      }
    }

    var partialPipelines = allComponents(ComponentType.DataSource).map(dsToPipeline)

    var i = 0
    var stop = false
    while (i < 1000 && !stop) {
      val next = nextRound(partialPipelines)
      stop = next.isEmpty
      partialPipelines = partialPipelines.++(next)
      println(i)
      println(partialPipelines)
      i += 1
    }

    partialPipelines
  }

  private def tryAdd(componentToAddSpecificTemplate: SpecificComponentTemplate, partialPipelines: Seq[PartialPipeline])(implicit session: Session): Seq[PartialPipeline] = {
    partialPipelines.flatMap { partialPipeline =>
      println("trying to add "+componentToAddSpecificTemplate.componentTemplate.uri+" to "+partialPipeline)
      InternalComponent(componentToAddSpecificTemplate).checkCouldBeBoundWith(InternalComponent(partialPipeline.specificComponentTemplates.last))
      None
    }
  }

  private def dsToPipeline(dataSource: SpecificComponentTemplate): PartialPipeline = {
    PartialPipeline(Seq(dataSource), Seq())
  }
}