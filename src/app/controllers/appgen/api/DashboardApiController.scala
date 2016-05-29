package controllers.appgen.api

import controllers.appgen.api.JsonImplicits._
import controllers.appgen.api.rest.SecuredRestController
import model.appgen.entity.UserPipelineDiscoveryId
import model.appgen.rest.EmptyRequest.EmptyRequest
import model.appgen.rest.PaginatedRequest._
import scaldi.Injector
import model.appgen.rest.Response._
import model.appgen.service.{ApplicationsService, DiscoveriesService}

class DashboardApiController(implicit inj: Injector) extends SecuredRestController {
  val applicationsService = inject[ApplicationsService]
  val discoveriesService = inject[DiscoveriesService]

  def getApplications = RestAction[PaginatedRequest] { implicit request => json =>
    Ok(SuccessResponse(data = Seq(
      "items" -> applicationsService.findByUser(request.user, json.paginationInfo).map(_.removeConfiguration),
      "totalCount" -> applicationsService.countByUser(request.user)
    )))
  }

  def getDiscoveries = RestAction[PaginatedRequest] { implicit request => json =>
    Ok(SuccessResponse(data = Seq(
      "items" -> discoveriesService.findByUser(request.user, json.paginationInfo),
      "totalCount" -> discoveriesService.countByUser(request.user)
    )))
  }

  def deleteDiscovery(id: Long) = RestAction[EmptyRequest] { implicit request => json =>
    discoveriesService.findById(request.user, UserPipelineDiscoveryId(id)) match {
      case Some(discovery) =>
        discoveriesService.delete(discovery)
        Ok(SuccessResponse("The discovery has been deleted"))
      case None => BadRequest(ErrorResponse("The discovery does not exist or is not accessible"))
    }
  }
}
