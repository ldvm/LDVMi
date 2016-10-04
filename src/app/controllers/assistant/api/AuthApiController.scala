package controllers.assistant.api

import controllers.assistant.api.rest.SecuredRestController
import model.assistant.entity.User
import model.assistant.rest.SignUpRequest._
import model.assistant.rest.SignInRequest._
import model.assistant.rest.EmptyRequest._
import model.assistant.rest.GoogleSignInRequest.GoogleSignInRequest
import model.assistant.service.{UserAlreadyExists, UserSuccessfullyAdded}
import play.api.mvc._
import scaldi.Injector
import play.api.db.slick._
import play.api.Play.current
import model.assistant.rest.Response._
import model.assistant.rest.RestRequestWithUser

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
          case Some(User(id, name, email, password, isAdmin)) => Ok(
            SuccessResponse(data = Seq("id" -> id, "name" -> name, "email" -> email, "isAdmin" -> isAdmin)))
            .withSession("userEmail" -> email)
          case None => BadRequest(ErrorResponse("Invalid e-mail and password combination"))
        }
      }
    )
  }}

  def googleSignIn = Action(BodyParsers.parse.json) { request => DB.withSession { implicit session =>
    request.body.validate[GoogleSignInRequest].fold(
      errors => { BadRequest(InvalidJsonResponse(errors)) },
      json => {
        userService.googleSignIn(json.token) match {
          case Some(User(id, name, email, password, isAdmin)) => Ok(
            SuccessResponse(data = Seq("id" -> id, "name" -> name, "email" -> email, "isAdmin" -> isAdmin)))
            .withSession("userEmail" -> email)
          case None => BadRequest(ErrorResponse("Google Sign-In failed"))
        }
      }
    )
  }}

  def getUser = RestAction[EmptyRequest] { implicit request: RestRequestWithUser => json =>
    request.user match {
      case User(id, name, email, password, isAdmin) =>
        Ok(SuccessResponse(data = Seq("id" -> id, "name" -> name, "email" -> email, "isAdmin" -> isAdmin)))
    }
  }

  def signOut = RestAction[EmptyRequest] { implicit request: RestRequestWithUser => json =>
    request.user match {
      case User(id, name, email, password, isAdmin) =>
        Ok(SuccessResponse("You've been signed out")).withNewSession
    }
  }
}
