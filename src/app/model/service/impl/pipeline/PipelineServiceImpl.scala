package model.service.impl.pipeline

import akka.actor.{ActorRef, Props}
import controllers.api.JsonImplicits._
import controllers.api.ProgressReporter
import model.entity._
import model.rdf.sparql.datacube.DataCubeQueryData
import model.repository._
import model.service._
import play.api.db.slick.Session
import play.api.libs.json.{JsSuccess, Json}
import scaldi.{Injectable, Injector}
import utils.{MD5, PaginationInfo}

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

  def save(pipeline: model.dto.BoundComponentInstances)(implicit session: Session): PipelineId = {

    val bindingSetId = componentInstanceService.saveMembers(pipeline)

    save(Pipeline(
      None,
      bindingSetId._1,
      pipeline.uri.getOrElse("Unlabeled pipeline"),
      pipeline.title.getOrElse("Unlabeled pipeline"),
      description = None,
      isTemporary = false,
      pipelineDiscovery = None
    ))
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

        val dsNames = "(" + instances.filter(_.componentTemplate.inputTemplates.size == 0).map(_.title).mkString(", ") + ")"
        val vizName = "(" + instances.filter(_.componentTemplate.outputTemplate.isEmpty).map(_.title).mkString(", ") + ")"
        val name = dsNames + " -> (" + (instances.size - 2) + ") -> " + vizName
        pipelinesRepository.save(Pipeline(None, bindingSetId, "", name, None, isTemporary = true, pipelineDiscovery = Some(pipelineDiscoveryId)))

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
    visualizerId: Option[ComponentTemplateId] = None
    )
    (ordering: PipelineTable => T = { e: PipelineTable => (e.modifiedUtc.desc, e.createdUtc.desc) })
    (implicit session: Session): Seq[Pipeline] = {

    repository.findPaginatedFilteredOrdered(paginationInfo)(pipelineDiscoveryId, visualizerId)(ordering)
  }

  def discover(reporterProps: Props, dataSourceTemplateId: Option[Long], combine: Boolean = false)(implicit session: Session): PipelineDiscoveryId = {
    val allComponentsByType = componentService.getAllForDiscovery(dataSourceTemplateId, combine)
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
}
