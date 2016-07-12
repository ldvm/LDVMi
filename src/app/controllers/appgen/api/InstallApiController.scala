package controllers.appgen.api

import controllers.appgen.api.rest.SecuredRestController
import model.appgen.entity.InstallResult
import model.appgen.rest.EmptyRequest.EmptyRequest
import model.appgen.rest.Response._
import model.appgen.rest.RestRequestWithUser
import play.api.mvc._
import scaldi.Injector

class InstallApiController(implicit inj: Injector) extends SecuredRestController {

  def install = RestAction[EmptyRequest] { implicit request => json =>
    requireAdmin {
      val results = List(
        InstallResult.success("Data source 'Integrated prevention and pollution limitation' added"),
        InstallResult.failure("Component failed"))
      Ok(SuccessResponse("The installation finished", Seq("results" -> results)))
    }
  }

  private def requireAdmin(func: => Result)(implicit request: RestRequestWithUser): Result = {
    if (request.user.isAdmin)
      func
    else
      Unauthorized(ErrorResponse("You need to be administrator to perform this operation"))
  }
}
