package controllers.appgen.api

import controllers.appgen.api.rest.SecuredRestController
import model.appgen.rest.EmptyRequest.EmptyRequest
import model.appgen.rest.Response._
import model.appgen.service.InstallService
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
