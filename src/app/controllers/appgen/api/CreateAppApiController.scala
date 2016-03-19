package controllers.appgen.api

import play.api.mvc._
import controllers.api.ProgressReporter
import controllers.appgen.api.JsonImplicits._
import controllers.api.JsonImplicits._
import model.appgen.entity._
import model.appgen.repository.{ApplicationsRepository, UserPipelineDiscoveryRepository, UserDataSourcesRepository}
import model.appgen.rest.AddDataSourceRequest._
import model.appgen.rest.EmptyRequest._
import model.appgen.rest.RunDiscoveryRequest._
import model.appgen.rest.CreateAppRequest._
import model.appgen.service.VisualizerService
import model.entity.{PipelineDiscovery, Pipeline, PipelineId}
import model.service.{PipelineService, DataSourceService}
import scaldi.Injector
import model.appgen.rest.Response._
import utils.PaginationInfo

class CreateAppApiController(implicit inj: Injector) extends RestController {
  val dataSourceService = inject[DataSourceService]
  val userDataSourceRepository = inject[UserDataSourcesRepository]
  val applicationsRepository = inject[ApplicationsRepository]
  val userPipelineDiscoveryRepository = inject[UserPipelineDiscoveryRepository]
  val pipelineService = inject[PipelineService]

  def addDataSource = RestAction[AddDataSourceRequest] { implicit request => json =>
    val dataSourceTemplateId = dataSourceService.createDataSourceFromUris(json.url, json.graphUris).get
    val id = userDataSourceRepository save
      new UserDataSource(None, json.name, json.isPublic, request.user.id.get, dataSourceTemplateId)
    Ok(SuccessResponse("Data source has been added",
      data = Seq("dataSource" -> userDataSourceRepository.findById(id).get)))
  }

  def getDataSources = RestAction[EmptyRequest] { implicit request => json =>
    val dataSources = userDataSourceRepository.find(request.user)
    Ok(SuccessResponse(data = Seq("dataSources" -> dataSources)))
  }

  def runDiscovery = RestAction[RunDiscoveryRequest] { implicit request => json =>
    val dataSources = userDataSourceRepository.findByIds(json.getIds).toList
    val discoveryName = dataSources.map(s => s.name) mkString ", "

    // Run the discovery on data sources and remember discovery id
    val logger = ProgressReporter.props // Use dummy logger
    val pipelineDiscoveryId = pipelineService.discover(logger,
      dataSources.map(s => s.dataSourceTemplateId.id))

    val id = userPipelineDiscoveryRepository save
      new UserPipelineDiscovery(None, discoveryName, request.user.id.get, pipelineDiscoveryId)

    Ok(SuccessResponse(data = Seq("userPipelineDiscoveryId" -> id)))
  }

  def getDiscovery(id: Long) = RestAction[EmptyRequest] { implicit request => json =>
    (for {
      userDiscovery <- userPipelineDiscoveryRepository.findById(request.user, UserPipelineDiscoveryId(id))
      discovery <- pipelineService.discoveryState(userDiscovery.pipelineDiscoveryId)
      pipelines <- Some(pipelineService.findPaginatedFiltered(PaginationInfo(0, 50), Some(userDiscovery.pipelineDiscoveryId))())
    } yield (userDiscovery, discovery, pipelines)) match {
      case Some((userDiscovery, discovery, pipelines)) =>
        Ok(SuccessResponse(data = Seq(
          "userPipelineDiscovery" -> userDiscovery,
          "pipelineDiscovery" -> discovery,
          "pipelines" -> pipelines)))
      case _ => BadRequest(ErrorResponse("Discovery was not found"))
    }
  }

  /** Load discovery from given pipeline. The discovery must belong to current user. */
  private def withDiscovery(id: PipelineId)
    (func: (Pipeline, PipelineDiscovery, UserPipelineDiscovery) => Result)
    (implicit request: RestRequest): Result = {
    (for {
      pipeline <- pipelineService.findById(id)
      discovery <- pipelineService.discoveryState(pipeline.pipelineDiscovery.get)
      userDiscovery <- userPipelineDiscoveryRepository.findByPipelineDiscovery(request.user, discovery.id.get)
    } yield (pipeline, discovery, userDiscovery)) match {
      case Some((pipeline, discovery, userDiscovery)) =>
        func(pipeline, discovery, userDiscovery)
      case None => BadRequest(ErrorResponse("The pipeline does not exist or is not accessible"))
    }
  }

  def runEvaluation(pipelineId: Long) = RestAction[EmptyRequest] { implicit request => json =>
    withDiscovery(PipelineId(pipelineId)) { (pipeline, discovery, userDiscovery) =>
      // Run the pipeline
      val logger = ProgressReporter.props // Use dummy logger
      pipelineService.evaluate(PipelineId(pipelineId))(logger)
      Ok(SuccessResponse("Evaluation has started"))
    }
  }

  def getEvaluations(discoveryId: Long) = RestAction[EmptyRequest] { implicit request => json =>
    (for {
      userDiscovery <- userPipelineDiscoveryRepository.findById(request.user, UserPipelineDiscoveryId(discoveryId))
      discovery <- pipelineService.discoveryState(userDiscovery.pipelineDiscoveryId)
      pipelines <- Some(pipelineService.findPaginatedFiltered(PaginationInfo(0, 50), Some(userDiscovery.pipelineDiscoveryId))())
      evaluations <- Some(pipelines flatMap {pipeline =>
        pipelineService.lastEvaluations(pipeline.id.get, PaginationInfo(0, 50))}
      )
    } yield (userDiscovery, discovery, pipelines, evaluations)) match {
      case Some((userDiscovery, discovery, pipelines, evaluations)) =>
        Ok(SuccessResponse(data = Seq(
          "evaluations" -> evaluations)))
      case _ => BadRequest(ErrorResponse("Discovery was not found"))
    }
  }

  def createApp = RestAction[CreateAppRequest] { implicit request => json =>
    withDiscovery(PipelineId(json.pipelineId)) { (pipeline, discovery, userDiscovery) =>
      val id = applicationsRepository save
        new Application(None, json.name, json.name, None,
          request.user.id.get,
          pipeline.id.get,
          userDiscovery.id.get,
          pipeline.visualizerComponentTemplateId, None)
      Ok(SuccessResponse("Application has been created", data = Seq("id" -> id)))
    }
  }
}
