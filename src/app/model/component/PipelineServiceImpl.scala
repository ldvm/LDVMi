package model.component

import java.io.StringWriter

import model.entity._
import model.repository._
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

  val dataPortBindingsRepository = inject[DataPortBindingRepository]
  val dataPortBindingSetsRepository = inject[DataPortBindingSetRepository]

  val inputInstancesRepository = inject[InputInstanceRepository]
  val outputInstancesRepository = inject[OutputInstanceRepository]

  val componentService = inject[ComponentService]

  override def save(pipeline: model.dto.Pipeline)(implicit session: Session): PipelineId = {

    val concreteInstanceIdsByUri = saveComponentInstances(pipeline.componentInstances)

    val inputInstancesWithComponentIds = pipeline.componentInstances.map { ci =>
      concreteInstanceIdsByUri.get(ci.componentInstance.uri).map { cid =>
        (cid, ci.componentInstance.inputInstances)
      }
    }.filter(_.isDefined).map(_.get)

    val outputInstancesWithComponentIds = pipeline.componentInstances.map { ci =>
      concreteInstanceIdsByUri.get(ci.componentInstance.uri).map { cid =>
        (cid, ci.componentInstance.outputInstance)
      }
    }.filter(_.isDefined).map(_.get).filter(_._2.isDefined).map { p => (p._1, p._2.get)}

    val inputInstancesByUri = saveInputInstances(inputInstancesWithComponentIds)
    val outputInstancesByUri = saveOutputInstances(outputInstancesWithComponentIds)

    val bindingSetId = saveBindings(pipeline, inputInstancesByUri, outputInstancesByUri)

    save(Pipeline(
      None,
      bindingSetId,
      pipeline.uri,
      pipeline.title.getOrElse("Unlabeled pipeline"),
      None
    ))
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
          concreteComponent.componentId,
          configString
        ))

        concreteComponent match {
          case a: Analyzer => analyzerInstancesRepository.save(AnalyzerInstance(None, componentInstanceId, a.id.get))
          case t: Transformer => transformerInstancesRepository.save(TransformerInstance(None, componentInstanceId, t.id.get))
          case v: Visualizer => visualizerInstancesRepository.save(VisualizerInstance(None, componentInstanceId, v.id.get))
          case d: DataSource => dataSourcesInstancesRepository.save(DataSourceInstance(None, componentInstanceId, d.id.get))
          case _ => throw new UnsupportedOperationException
        }

        (instance.componentInstance.uri, componentInstanceId)
      }
    }.filter(_.isDefined).map(_.get).toMap
  }

  def saveInputInstances(inputInstancesByComponentId: Seq[(ComponentInstanceId, Seq[model.dto.InputInstance])])(implicit session: Session): DataPortUriMap[InputInstanceId] = {

    inputInstancesByComponentId.map { case (componentInstanceId, inputInstances) =>
      inputInstances.map { inputInstance =>
        val dataPortInstanceId = dataPortInstancesRepository.save(DataPortInstance(
          None,
          componentInstanceId
        ))

        val id = inputInstancesRepository.save(InputInstance(
          None,
          dataPortInstanceId,
          componentInstanceId
        ))

        (inputInstance.uri, (id, dataPortInstanceId))
      }
    }.flatten.toMap
  }

  def saveOutputInstances(outputInstancesByComponentId: Seq[(ComponentInstanceId, model.dto.OutputInstance)])(implicit session: Session): DataPortUriMap[OutputInstanceId] = {

    outputInstancesByComponentId.map { case (componentInstanceId, outputInstance) =>
      val dataPortInstanceId = dataPortInstancesRepository.save(DataPortInstance(
        None,
        componentInstanceId
      ))

      val id = outputInstancesRepository.save(OutputInstance(
        None,
        dataPortInstanceId,
        componentInstanceId
      ))

      (outputInstance.uri, (id, dataPortInstanceId))
    }.toMap
  }

  private def saveBindings(pipeline: model.dto.Pipeline, inputInstancesByUri: DataPortUriMap[InputInstanceId], outputInstancesByUri: DataPortUriMap[OutputInstanceId])(implicit session: Session) : DataPortBindingSetId = {

    val inputSources = inputInstancesByUri.map { p => (p._1, p._2._2) }
    val outputSources = outputInstancesByUri.map { p => (p._1, p._2._2) }

    val sources = (inputSources ++ outputSources).toMap

    val bindingSetId = dataPortBindingSetsRepository.save(DataPortBindingSet(None))

    val inputInstances = pipeline.componentInstances.map(_.componentInstance.inputInstances).flatten
    inputInstances.map{ inputInstance =>
      val uri = inputInstance.uri
      val sourceUri = inputInstance.boundTo

      sources.get(sourceUri).map { sourceId =>
        dataPortBindingsRepository.save(DataPortBinding(None, bindingSetId, sourceId, inputInstancesByUri(uri)._1))
      }
    }

    bindingSetId
  }
}