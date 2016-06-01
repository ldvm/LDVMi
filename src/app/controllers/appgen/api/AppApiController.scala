package controllers.appgen.api

import play.api.mvc._
import controllers.appgen.api.JsonImplicits._
import controllers.appgen.api.rest.RestController
import model.appgen.entity._
import model.appgen.repository.ApplicationsRepository
import model.appgen.rest.EmptyRequest._
import scaldi.Injector
import model.appgen.rest.Response._
import model.appgen.rest.RestRequest
import model.appgen.service.ApplicationsService

/** Basic read-only API for loading applications */
class AppApiController(implicit inj: Injector) extends RestController {
  val applicationsRepository = inject[ApplicationsRepository]
  val applicationsService = inject[ApplicationsService]

  // This controller is not a secured controller, it doesn't require the user to be authenticated.
  // But we have to make sure that the visitor is not accessing applications that are not yet
  // published and we also want to allow owners to view their applications before they get
  // published.

  private def withApplication(id: ApplicationId)
    (func: Application => Result)
    (implicit request: RestRequest): Result = {
    applicationsService.getApplicationIfAccessible(id, request.user) match {
      case Some(application: Application) => func(application)
      case None => BadRequest(ErrorResponse("The application does not exist or is not accessible"))
    }
  }

  def getApp(id: Long) = RestAction[EmptyRequest] { implicit request => json =>
    withApplication(ApplicationId(id)) { application =>
      // Let's leave out the configuration, as it might be large. The user can always load it
      // using a separate request.
      Ok(SuccessResponse(data = Seq("application" -> application.copy(configuration = None))))
    }
  }

  def getAppConfiguration(id: Long) = RestAction[EmptyRequest] { implicit request => json =>
    withApplication(ApplicationId(id)) { application =>
      Ok(SuccessResponse(data = Seq("configuration" -> application.configuration)))
    }
  }

  def getLatestPublishedApps = RestAction[EmptyRequest] { implicit request => json =>
    val applications = applicationsService.findPublished.take(1)
    Ok(SuccessResponse(data = Seq("latestPublishedApps" -> applications)))
  }

  def getLatestUserApps = RestAction[EmptyRequest] { implicit request => json =>
    val applications: Seq[Application] = request.user match {
      case Some(user) => applicationsService.findByUser(user)
      case None => Seq.empty[Application]
    }
    Ok(SuccessResponse(data = Seq("latestUserApps" -> applications)))
  }
}
