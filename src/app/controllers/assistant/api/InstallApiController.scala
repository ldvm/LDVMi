package controllers.assistant.api

import controllers.assistant.api.rest.SecuredRestController
import model.assistant.rest.EmptyRequest.EmptyRequest
import model.assistant.rest.Response._
import model.assistant.service.InstallService
import scaldi.Injector

class InstallApiController(implicit inj: Injector) extends SecuredRestController {
  val installService = inject[InstallService]

  def install = RestAction[EmptyRequest] { implicit request => json =>
    if (request.user.isAdmin)
      Ok(SuccessResponse("The installation finished", Seq("results" -> installService.install)))
    else
      Unauthorized(ErrorResponse("You need to be administrator to perform this operation"))
  }
}
