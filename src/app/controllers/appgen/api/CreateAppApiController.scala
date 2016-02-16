package controllers.appgen.api

import controllers.appgen.api.JsonImplicits._
import model.appgen.entity.UserDataSource
import model.appgen.repository.UserDataSourcesRepository
import model.appgen.rest.AddDataSourceRequest._
import model.appgen.rest.EmptyRequest.EmptyRequest
import model.service.DataSourceService
import scaldi.Injector
import model.appgen.rest.Response._

class CreateAppApiController(implicit inj: Injector) extends RestController {
  val dataSourceService = inject[DataSourceService]
  val userDataSourceRepository = inject[UserDataSourcesRepository]

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
}
