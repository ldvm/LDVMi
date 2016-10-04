package controllers.assistant.api

import controllers.assistant.api.JsonImplicits._
import controllers.assistant.api.rest.RestController
import model.assistant.repository.ApplicationsRepository
import model.assistant.rest.PaginatedRequest._
import model.assistant.rest.Response._
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
