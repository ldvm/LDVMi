package controllers.appgen.api

import controllers.appgen.api.JsonImplicits._
import controllers.appgen.api.rest.SecuredRestController
import model.appgen.rest.PaginatedRequest._
import scaldi.Injector
import model.appgen.rest.Response._
import model.appgen.service.ApplicationsService

class DashboardApiController(implicit inj: Injector) extends SecuredRestController {
  val applicationsService = inject[ApplicationsService]

  def getApplications = RestAction[PaginatedRequest] { implicit request => json =>
    Ok(SuccessResponse(data = Seq(
      "items" -> applicationsService.findByUser(request.user, json.paginationInfo).map(_.removeConfiguration),
      "totalCount" -> applicationsService.countByUser(request.user)
    )))
  }
}
