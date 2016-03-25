package controllers.appgen.api

import model.appgen.rest.SaveAppConfigurationRequest.SaveAppConfigurationRequest
import model.appgen.rest.UpdateAppSettingsRequest.UpdateAppSettingsRequest
import play.api.mvc._
import controllers.appgen.api.rest.SecuredRestController
import model.appgen.entity._
import model.appgen.repository.ApplicationsRepository
import scaldi.Injector
import model.appgen.rest.Response._
import model.appgen.rest.RestRequestWithUser

/** Basic API for general application management */
class ManageAppApiController(implicit inj: Injector) extends SecuredRestController {
  val applicationsRepository = inject[ApplicationsRepository]

  private def withApplication(id: ApplicationId)
    (func: Application => Result)
    (implicit request: RestRequestWithUser): Result = {
    applicationsRepository.findById(request.user, id) match {
      case Some(application: Application) => func(application)
      case None => BadRequest(ErrorResponse("The application does not exist or is not accessible"))
    }
  }

  def updateAppSettings(id: Long) = RestAction[UpdateAppSettingsRequest] { implicit request => json =>
    withApplication(ApplicationId(id)) { application =>
      var updated = application.copy(
        name = json.name,
        description = if (json.description == "") None else Some(json.description)
      )

      if (json.updateUrl) {
        updated = updated.withUpdatedUid
      }

      applicationsRepository.save(updated)
      Ok(SuccessResponse("The application has been updated"))
    }
  }

  def saveAppConfiguration(id: Long) = RestAction[SaveAppConfigurationRequest] { implicit request => json =>
    withApplication(ApplicationId(id)) { application =>
      applicationsRepository.save(application.copy(configuration = Some(json.configuration)))
      Ok(SuccessResponse("The configuration has been saved"))
    }
  }
}
