package controllers.appgen.api

import play.api.mvc._
import controllers.appgen.api.JsonImplicits._
import controllers.appgen.api.rest.SecuredRestController
import model.appgen.entity.{Discovery, UserPipelineDiscoveryId}
import model.appgen.rest.EmptyRequest.EmptyRequest
import model.appgen.rest.PaginatedRequest._
import scaldi.Injector
import model.appgen.rest.Response._
import model.appgen.rest.RestRequestWithUser
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

  def getDiscovery(id: Long) = RestAction[EmptyRequest] { implicit request => json =>
    withDiscovery(UserPipelineDiscoveryId(id)) { discovery =>
      Ok(SuccessResponse(data = Seq("discovery" -> discovery)))
    }
  }

  def deleteDiscovery(id: Long) = RestAction[EmptyRequest] { implicit request => json =>
    withDiscovery(UserPipelineDiscoveryId(id)) { discovery =>
      discoveriesService.delete(discovery)
      Ok(SuccessResponse("The discovery has been deleted"))
    }
  }

  def deleteAllDiscoveries = RestAction[EmptyRequest] { implicit request => json =>
    discoveriesService.findByUser(request.user).foreach(discovery =>
      discoveriesService.delete(discovery))
    Ok(SuccessResponse("All discoveries have been deleted"))
  }

  private def withDiscovery(id: UserPipelineDiscoveryId)
    (func: (Discovery) => Result)
    (implicit request: RestRequestWithUser): Result = {
    discoveriesService.findById(request.user, id) match {
      case Some(discovery) => func(discovery)
      case None => BadRequest(ErrorResponse("The discovery does not exist or is not accessible"))
    }
  }
}
