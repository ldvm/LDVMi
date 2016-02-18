package controllers.appgen.api

import controllers.api.ProgressReporter
import controllers.appgen.api.JsonImplicits._
import controllers.api.JsonImplicits._
import model.appgen.entity._
import model.appgen.repository.{UserPipelineDiscoveryRepository, UserDataSourcesRepository}
import model.appgen.rest.AddDataSourceRequest._
import model.appgen.rest.EmptyRequest._
import model.appgen.rest.RunDiscoveryRequest._
import model.service.{PipelineService, DataSourceService}
import scaldi.Injector
import model.appgen.rest.Response._
import utils.PaginationInfo

class CreateAppApiController(implicit inj: Injector) extends RestController {
  val dataSourceService = inject[DataSourceService]
  val userDataSourceRepository = inject[UserDataSourcesRepository]
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

    // Run the pipeline on data sources and remember discovery id
    // TODO: run async
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
}
