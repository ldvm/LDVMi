package controllers.appgen.api

import model.appgen.rest.SignUpRequest._
import model.appgen.service.{UserAlreadyExists, UserSuccessfullyAdded, UserService}
import play.api.mvc._
import scaldi.{Injectable, Injector}
import play.api.db.slick._
import play.api.Play.current
import model.appgen.rest.Response._

class AuthApiController(implicit inj: Injector) extends Controller with Injectable {

  var userService = inject[UserService]

  def signUp = Action(BodyParsers.parse.json) { request => DB.withSession { implicit session =>
    request.body.validate[SignUpRequest].fold(
      errors => { BadRequest(InvalidJsonResponse(errors)) },
      json => {
        userService.addUser(json.name, json.email, json.password) match {
          case UserSuccessfullyAdded(id) => Ok(SuccessResponse(data = Seq("id" -> id)))
          case UserAlreadyExists => BadRequest(ErrorResponse("User already exists",
            Seq("email" -> "E-mail address already exists")))
        }
      }
    )
  }}
}
