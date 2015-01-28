package model.service.impl

import java.io.StringWriter

import akka.actor.{ActorRef, Props}
import model.entity._
import model.repository._
import model.service._
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

import scala.slick.lifted.Ordered

class ComponentInstanceServiceImpl(implicit inj: Injector) extends ComponentInstanceService with Injectable with Connected {

  type DataPortUriMap[T] = Map[String, (T, DataPortInstanceId)]

  val repository = inject[ComponentInstanceRepository]
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
  private val dataPortBindingSetsRepository = inject[DataPortBindingSetRepository]

  private val inputInstancesRepository = inject[InputInstanceRepository]
  private val outputInstancesRepository = inject[OutputInstanceRepository]

  private val componentService = inject[ComponentTemplateService]

  def saveMembers(boundInstances: model.dto.BoundComponentInstances)(implicit session: Session) : DataPortBindingSetId = {
    val instanceIdsByUri = saveComponentInstances(boundInstances.componentInstances)
    val inputInstancesByUri = saveInputInstances(boundInstances.inputInstancesWithComponentIds(instanceIdsByUri))
    val outputInstancesByUri = saveOutputInstances(boundInstances.outputInstancesWithComponentIds(instanceIdsByUri))
    val bindingSetId = saveBindings(boundInstances, inputInstancesByUri, outputInstancesByUri)

    saveMemberships(bindingSetId, instanceIdsByUri.values.toList)
    bindingSetId
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
          inputTemplateId = input.id.get,
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

  private def saveBindings(pipeline: model.dto.BoundComponentInstances, inputInstancesByUri: DataPortUriMap[InputInstanceId], outputInstancesByUri: DataPortUriMap[OutputInstanceId])
    (implicit session: Session)
  : DataPortBindingSetId = {

    val inputSources = inputInstancesByUri.map { case (key, (_, portId)) => (key, portId)}
    val outputSources = outputInstancesByUri.map { case (key, (_, portId)) => (key, portId)}

    val sources = (inputSources ++ outputSources).toMap

    val bindingSetId = dataPortBindingSetsRepository.save(DataPortBindingSet(None))

    val inputInstances = pipeline.componentInstances.flatMap(_.componentInstance.inputInstances)
    inputInstances.map { inputInstance =>
      val uri = inputInstance.uri
      val sourceUris = inputInstance.boundTo

      sourceUris.map { sourceUri =>
        sources.get(sourceUri).map { sourceId =>
          dataPortBindingsRepository.save(DataPortBinding(None, bindingSetId, sourceId, inputInstancesByUri(uri)._2))
        }
      }
    }

    bindingSetId
  }

}