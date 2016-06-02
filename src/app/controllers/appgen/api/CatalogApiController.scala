package controllers.appgen.api

import controllers.appgen.api.JsonImplicits._
import controllers.appgen.api.rest.RestController
import model.appgen.repository.ApplicationsRepository
import model.appgen.rest.PaginatedRequest._
import model.appgen.rest.Response._
import play.api.mvc._
import scaldi.Injector

class CatalogApiController(implicit inj: Injector) extends RestController {
  val applicationsRepository = inject[ApplicationsRepository]

  def getPublishedApps = RestAction[PaginatedRequest] { implicit request => json =>
    Ok(SuccessResponse(data = Seq(
      "items" -> applicationsRepository.findPublished(json.paginationInfo).map(_.removeConfiguration),
      "totalCount" -> applicationsRepository.countPublished
    )))
  }
}
