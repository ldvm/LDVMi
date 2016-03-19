package controllers.appgen.api

import model.appgen.rest.SaveAppConfigurationRequest.SaveAppConfigurationRequest
import play.api.mvc._
import controllers.appgen.api.JsonImplicits._
import controllers.api.JsonImplicits._
import model.appgen.entity._
import model.appgen.repository.ApplicationsRepository
import model.appgen.rest.EmptyRequest._
import scaldi.Injector
import model.appgen.rest.Response._

class ManageAppApiController(implicit inj: Injector) extends RestController {
  val applicationsRepository = inject[ApplicationsRepository]

  private def withApplication(id: ApplicationId)
    (func: Application => Result)
    (implicit request: RestRequest): Result = {
    applicationsRepository.findById(request.user, id) match {
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

  def saveAppConfiguration(id: Long) = RestAction[SaveAppConfigurationRequest] { implicit request => json =>
    withApplication(ApplicationId(id)) { application =>
      applicationsRepository.save(application.copy(configuration = Some(json.configuration)))
      Ok(SuccessResponse("The configuration has been saved"))
    }
  }
}
