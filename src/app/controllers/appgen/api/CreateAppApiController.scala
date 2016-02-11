package controllers.appgen.api

import model.appgen.entity.UserDataSource
import model.appgen.repository.UserDataSourcesRepository
import model.appgen.rest.AddDataSourceRequest._
import model.service.DataSourceService
import scaldi.Injector
import model.appgen.rest.Response._

class CreateAppApiController(implicit inj: Injector) extends RestController {
  var dataSourceService = inject[DataSourceService]
  val userDataSourceRepository = inject[UserDataSourcesRepository]

  def addDataSource = RestAction[AddDataSourceRequest] { implicit request => json =>
    val dataSourceTemplateId = dataSourceService.createDataSourceFromUris(json.url, json.graphUris).get
    userDataSourceRepository save
      new UserDataSource(None, json.name, json.isPublic, request.user.id.get, dataSourceTemplateId)
    Ok(SuccessResponse("Data source has been added"))
  }
}
