package controllers.assistant.api

import model.assistant.rest.SaveAppConfigurationRequest.SaveAppConfigurationRequest
import model.assistant.rest.UpdateAppSettingsRequest.UpdateAppSettingsRequest
import play.api.mvc._
import controllers.assistant.api.rest.SecuredRestController
import model.assistant.entity._
import model.assistant.repository.ApplicationsRepository
import model.assistant.rest.EmptyRequest.EmptyRequest
import model.assistant.rest.PublishAppRequest.PublishAppRequest
import scaldi.Injector
import model.assistant.rest.Response._
import model.assistant.rest.RestRequestWithUser

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

  def publishApp(id: Long) = RestAction[PublishAppRequest] { implicit request => json =>
    withApplication(ApplicationId(id)) { application =>
      applicationsRepository.save(application.copy(published = json.published))
      json.published match {
        case true => Ok(SuccessResponse("The application has been published"))
        case false => Ok(SuccessResponse("The application is no longer published"))
      }
    }
  }
  
  def deleteApp(id: Long) = RestAction[EmptyRequest] { implicit request => json =>
    withApplication(ApplicationId(id)) { application =>
      applicationsRepository.deleteById(application.id.get)
      Ok(SuccessResponse("The application has been deleted"))
    }
  }
}
