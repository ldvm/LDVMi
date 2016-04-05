package model.service.impl.pipeline

import java.util.UUID

import akka.actor.{ActorRef, Props}
import controllers.api.JsonImplicits._
import controllers.api.ProgressReporter
import model.entity._
import model.rdf.Graph
import model.rdf.sparql.GenericSparqlEndpoint
import model.rdf.sparql.datacube.DataCubeQueryData
import model.repository._
import model.service._
import play.api.db.slick.Session
import play.api.libs.json.{JsSuccess, Json}
import scaldi.{Injectable, Injector}
import utils.{MD5, PaginationInfo}
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.Ordered

class PipelineServiceImpl(implicit inj: Injector) extends PipelineService with Injectable with SessionScoped {

  type DataPortUriMap[T] = Map[String, (T, DataPortInstanceId)]

  val repository = inject[PipelineRepository]
  private val dataPortInstancesRepository = inject[DataPortInstanceRepository]
  private val componentInstancesRepository = inject[ComponentInstanceRepository]
  private val componentInstanceMembershipRepository = inject[ComponentInstanceMembershipRepository]

  private val pipelineDiscoveryRepository = inject[PipelineDiscoveryRepository]
  private val pipelineEvaluationRepository = inject[PipelineEvaluationRepository]
  private val pipelineEvaluationQueryRepository = inject[PipelineEvaluationQueryRepository]
  private val pipelinesRepository = inject[PipelineRepository]

  private val dataPortBindingsRepository = inject[DataPortBindingRepository]
  private val dataPortBindingSetsRepository = inject[DataPortBindingSetRepository]

  private val inputInstancesRepository = inject[InputInstanceRepository]
  private val outputInstancesRepository = inject[OutputInstanceRepository]

  private val componentService = inject[ComponentTemplateService]
  private val componentInstanceService = inject[ComponentTemplateService]
  private val compatibilityService = inject[CompatibilityService]

  private val dataSourceInstancesRepository = inject[DataSourceInstanceRepository]
  private val visualizerInstancesRepository = inject[VisualizerInstanceRepository]

  private val pipelineEvaluationResultsRepository = inject[PipelineEvaluationResultRepository]

  def save(pipeline: model.dto.BoundComponentInstances)(implicit session: Session): PipelineId = {

    val bindingSetId = componentInstanceService.saveMembers(pipeline)

    save(Pipeline(
      None,
      bindingSetId._1,
      pipeline.uri.getOrElse("Unlabeled pipeline"),
      pipeline.title.getOrElse("Unlabeled pipeline"),
      description = None,
      componentTemplatesQuery.filter(_.uri === pipeline.componentInstances.last.componentInstance.templateUri).first.id.get,
      isTemporary = false,
      pipelineDiscovery = None
    ))
  }
  
  def evaluateSimplePipeline(componentTemplates: (DataSourceTemplate, VisualizerTemplate))(implicit session: Session): Option[PipelineEvaluationId] = {
    val set = DataPortBindingSet(None)
    val setId = dataPortBindingSetsRepository.save(set)

    val dataSourceTemplate = componentTemplates._1
    val visualizerTemplate = componentTemplates._2

    val dataSourceInstanceUri = dataSourceTemplate.componentTemplate.uri + "#instance"
    val visualizerInstanceUri = visualizerTemplate.componentTemplate.uri + "#instance"

    val dataSourceComponent = ComponentInstance(None, dataSourceInstanceUri, dataSourceTemplate.componentTemplate.title, None, dataSourceTemplate.componentTemplateId)
    val visualizerComponent = ComponentInstance(None, visualizerInstanceUri, visualizerTemplate.componentTemplate.title, None, visualizerTemplate.componentTemplateId)

    val dataSourceComponentId = componentInstancesRepository.save(dataSourceComponent)
    val visualizerComponentId = componentInstancesRepository.save(visualizerComponent)

    val dataSourceInstance = DataSourceInstance(None, dataSourceComponentId, dataSourceTemplate.id.get)
    val visualizerInstance = VisualizerInstance(None, visualizerComponentId, visualizerTemplate.id.get)

    dataSourceInstancesRepository.save(dataSourceInstance)
    visualizerInstancesRepository.save(visualizerInstance)

    componentInstanceMembershipRepository.save(ComponentInstanceMembership(None, setId, dataSourceComponentId))
    componentInstanceMembershipRepository.save(ComponentInstanceMembership(None, setId, visualizerComponentId))

    val outputPort = DataPortInstance(None, "urn:p1", "DS output", None, dataSourceComponentId, dataSourceTemplate.componentTemplate.outputTemplate.get.dataPortTemplate.id.get)
    val inputPort = DataPortInstance(None, "urn:p1", "DS output", None, dataSourceComponentId, visualizerTemplate.componentTemplate.inputTemplates.head.dataPortTemplate.id.get)

    val outputPortId = dataPortInstancesRepository.save(outputPort)
    val inputPortId = dataPortInstancesRepository.save(inputPort)

    val dataSourceOutput = OutputInstance(None, outputPortId, dataSourceTemplate.componentTemplate.outputTemplate.get.id.get, dataSourceComponentId)
    val visualizerInput = InputInstance(None, inputPortId, visualizerTemplate.componentTemplate.inputTemplates.head.id.get, visualizerComponentId)

    outputInstancesRepository.save(dataSourceOutput)
    inputInstancesRepository.save(visualizerInput)

    val binding = DataPortBinding(None, setId, outputPortId, inputPortId)
    dataPortBindingsRepository.save(binding)

    val pipeline = Pipeline(
      None,
      setId,
      "urn:"+UUID.randomUUID().toString,
      "Validator: (" + dataSourceTemplate.componentTemplate.title + " -> " + visualizerTemplate.componentTemplate.title + " )",
      None,
      visualizerInstance.template.componentTemplateId
    )

    val pipelineId = pipelinesRepository.save(pipeline)

    val evaluation = PipelineEvaluation(None, pipelineId, true, Some(true))
    val evaluationId = pipelineEvaluationRepository.save(evaluation)

    val endpoint = GenericSparqlEndpoint(None, Graph(dataSourceTemplate.componentTemplate.defaultConfiguration))

    endpoint.map { e =>
      val r = PipelineEvaluationResult(None, evaluationId, visualizerTemplate.componentTemplateId, visualizerTemplate.componentTemplate.inputTemplates.head.dataPortTemplate.id.get, e.endpointURL, e.namedGraphs.headOption)
      pipelineEvaluationResultsRepository.save(r)
      evaluationId
    }
  }

  def discoveryState(pipelineDiscoveryId: PipelineDiscoveryId)(implicit session: Session): Option[PipelineDiscovery] = {
    pipelineDiscoveryRepository.findById(pipelineDiscoveryId)
  }

  def lastEvaluations(pipelineId: PipelineId, paginationInfo: PaginationInfo)(implicit session: Session): Seq[PipelineEvaluation] = {
    pipelineEvaluationRepository.lastEvaluationsOf(pipelineId, paginationInfo)
  }

  def findEvaluationById(evaluationId: PipelineEvaluationId)(implicit session: Session): Option[PipelineEvaluation] = {
    pipelineEvaluationRepository.findById(evaluationId)
  }

  def setEvaluationQuery(token: String, query: PipelineEvaluationQuery)(implicit session: Session): PipelineEvaluationQueryId = {
    pipelineEvaluationQueryRepository.findByToken(token).map(q => pipelineEvaluationQueryRepository.remove(q))
    pipelineEvaluationQueryRepository.save(query)
  }

  def findQueryByIdAndToken(id: PipelineEvaluationId, token: String)(implicit session: Session): Option[PipelineEvaluationQuery] = {
    pipelineEvaluationQueryRepository.findByToken(token)
  }

  def modifyEvaluationQuery(id: PipelineEvaluationId, token: String, dimensionUri: String, valueUri: String)(implicit session: Session): Option[String] = {
    findQueryByIdAndToken(id, token).flatMap { query =>

      getCubeQuery(query.storedData).map { originalQuery =>
        val modifiedQuery = originalQuery.modify(dimensionUri, valueUri)
        val modifiedString = Json.toJson(modifiedQuery).toString()
        val token = MD5.hash(modifiedString)
        val newQuery = query.copy(id = None, token = token, storedData = modifiedString)
        setEvaluationQuery(token, newQuery)

        token
      }
    }
  }

  private def getCubeQuery(json: String): Option[DataCubeQueryData] = {
    val parsedJson = Json.parse(json)
    val result = parsedJson.validate[DataCubeQueryData]

    result match {
      case s: JsSuccess[DataCubeQueryData] => Some(s.get)
      case _ => None
    }
  }

  def saveDiscoveryResults(pipelineDiscoveryId: PipelineDiscoveryId, pipelines: Seq[PartialPipeline], jsLogger: ActorRef): Unit = {
    withSession { implicit session =>
      pipelines.map { pipeline =>

        val bindingSetId = dataPortBindingSetsRepository.save(DataPortBindingSet(None))

        val instanceData = pipeline.componentInstances.map { componentInstance =>
          val result = createInstance(componentInstance)
          componentInstanceMembershipRepository.save(ComponentInstanceMembership(None, bindingSetId, result._1))
          (componentInstance, result)
        }.toMap

        val instances = pipeline.componentInstances

        val datasources = instances.filter(_.componentTemplate.inputTemplates.isEmpty)
        val visualizers = instances.filter(_.componentTemplate.outputTemplate.isEmpty)
        val visualizer = visualizers.head // if the visualizer is not present, it's not a pipeline

        val dsNames = "(" + datasources.map(_.title).mkString(", ") + ")"
        val vizName = "(" + visualizer.title + ")"
        val info = if (instances.size > 2) { " -> (" + (instances.size - 2) + ") -> " } else { " -> " }
        val name = dsNames + info + vizName

        val isTemporary = true
        pipelinesRepository.save(Pipeline(None, bindingSetId, "", name, None, visualizer.componentTemplate.id.get, isTemporary, Some(pipelineDiscoveryId)))

        pipeline.portMappings.map { mapping =>
          val sourceId = instanceData(mapping.sourceComponentInstance)._3.get
          val targetId = instanceData(mapping.targetComponentInstance)._2(mapping.viaPortUri)
          val binding = DataPortBinding(None, bindingSetId, sourceId, targetId)
          dataPortBindingsRepository.save(binding)
        }

        compatibilityService.check(DataPortBindingSet(Some(bindingSetId)), ProgressReporter.props(jsLogger))
      }
    }
  }

  private def createInstance(componentInstance: ComponentInstance)(implicit session: Session)
  : (ComponentInstanceId, Map[String, DataPortInstanceId], Option[DataPortInstanceId]) = {
    val componentInstanceId = componentInstancesRepository.save(componentInstance)
    val inputPortIdsByUri = componentInstance.componentTemplate.inputTemplates.map { it =>
      val portTemplate = it.dataPortTemplate
      val portInstance = DataPortInstance(None, portTemplate.uri + "/instance", portTemplate.title, None, componentInstanceId, portTemplate.id.get)
      val portInstanceId = dataPortInstancesRepository.save(portInstance)
      val inputInstance = InputInstance(None, portInstanceId, it.id.get, componentInstanceId)
      inputInstancesRepository.save(inputInstance)
      (portTemplate.uri, portInstanceId)
    }.toMap

    val maybeOutputId = componentInstance.componentTemplate.outputTemplate.map { ot =>
      val portTemplate = ot.dataPortTemplate
      val portInstance = DataPortInstance(None, portTemplate.uri + "/instance", portTemplate.title, None, componentInstanceId, portTemplate.id.get)
      val portInstanceId = dataPortInstancesRepository.save(portInstance)
      val outputInstance = OutputInstance(None, portInstanceId, ot.id.get, componentInstanceId)
      outputInstancesRepository.save(outputInstance)
      portInstanceId
    }

    (componentInstanceId, inputPortIdsByUri, maybeOutputId)
  }

  def findPaginatedFiltered[T <% Ordered](
    paginationInfo: PaginationInfo,
    pipelineDiscoveryId: Option[PipelineDiscoveryId] = None,
    visualizerId: Option[ComponentTemplateId] = None,
    onlyPermanent: Boolean = false
    )
    (ordering: PipelineTable => T = { e: PipelineTable => (e.modifiedUtc.desc, e.createdUtc.desc) })
    (implicit session: Session): Seq[Pipeline] = {

    repository.findPaginatedFilteredOrdered(paginationInfo)(pipelineDiscoveryId, visualizerId, onlyPermanent)(ordering)
  }

  def discover(reporterProps: Props, dataSourceTemplateIds: List[Long], combine: Boolean = false)(implicit session: Session): PipelineDiscoveryId = {
    val allComponentsByType = componentService.getAllForDiscovery(dataSourceTemplateIds, combine)
    new PipelineDiscoveryAlgorithm(allComponentsByType._1, reporterProps, allComponentsByType._2)
      .discoverPipelines(
        allComponentsByType._1(ComponentType.DataSource).collect { case d: DataSourceTemplate => d }
      )
  }

  def evaluate(pipelineId: PipelineId)(logger: Props)(implicit session: Session): Option[PipelineEvaluationId] = {
    findById(pipelineId).map { pipeline =>
      val evaluation = PipelineEvaluation(None, pipelineId, false, None)
      val id = pipelineEvaluationRepository.save(evaluation)
      new PipelineEvaluationAlgorithm(evaluation.copy(id = Some(id)), logger).run(pipeline.bindingSet)
      id
    }
  }

  def makePermanent(pipelineId: PipelineId)(implicit session: Session) = {
    findById(pipelineId).map { p =>
      repository.save(p.copy(isTemporary = false))
    }
  }
}
