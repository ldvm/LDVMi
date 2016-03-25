package controllers.appgen.api

import controllers.appgen.api.rest.SecuredRestController
import model.appgen.entity.User
import model.appgen.rest.SignUpRequest._
import model.appgen.rest.SignInRequest._
import model.appgen.rest.EmptyRequest._
import model.appgen.service.{UserAlreadyExists, UserSuccessfullyAdded}
import play.api.mvc._
import scaldi.Injector
import play.api.db.slick._
import play.api.Play.current
import model.appgen.rest.Response._
import model.appgen.rest.RestRequestWithUser

class AuthApiController(implicit inj: Injector) extends SecuredRestController {

  def signUp = Action(BodyParsers.parse.json) { request => DB.withSession { implicit session =>
    request.body.validate[SignUpRequest].fold(
      errors => { BadRequest(InvalidJsonResponse(errors)) },
      json => {
        userService.add(json.name, json.email, json.password) match {
          case UserSuccessfullyAdded(id) => Ok(SuccessResponse(data = Seq("id" -> id)))
          case UserAlreadyExists => BadRequest(ErrorResponse("User already exists",
            Seq("email" -> "E-mail address already exists")))
        }
      }
    )
  }}

  def signIn = Action(BodyParsers.parse.json) { request => DB.withSession { implicit session =>
    request.body.validate[SignInRequest].fold(
      errors => { BadRequest(InvalidJsonResponse(errors)) },
      json => {
        userService.find(json.email, json.password) match {
          case Some(User(id, name, email, password)) => Ok(
            SuccessResponse(data = Seq("id" -> id, "name" -> name, "email" -> email)))
            .withSession("userEmail" -> email)
          case None => BadRequest(ErrorResponse("Invalid e-mail and password combination"))
        }
      }
    )
  }}

  def getUser = RestAction[EmptyRequest] { implicit request: RestRequestWithUser => json =>
    request.user match {
      case User(id, name, email, password) =>
        Ok(SuccessResponse(data = Seq("id" -> id, "name" -> name, "email" -> email)))
    }
  }
}
