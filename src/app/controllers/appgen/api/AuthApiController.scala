package controllers.appgen.api

import model.appgen.entity.User
import model.appgen.service.{UserAlreadyExists, UserSuccessfullyAdded, UserService}
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}
import play.api.db.slick.{_}
import play.api.Play.current

class AuthApiController(implicit inj: Injector) extends Controller with Injectable {

  var userService = inject[UserService]

  def signUp = Action(BodyParsers.parse.json) { request => DB.withSession { implicit session =>
    // TODO: move the implicit converter to the companion object
    // (how to modify implicit companion object?)
    implicit val userReads: Reads[User] = Json.reads[User]

    request.body.validate[User].fold(
      errors => { BadRequest(Json.obj("status" -> "OK", "message" -> JsError.toFlatJson(errors))) },
      user => {
        userService.addUser(user) match {
          case UserSuccessfullyAdded(id) => Ok(Json.obj("status" -> "OK", "id" -> id))
          case UserAlreadyExists => Ok(Json.obj("status" -> "KO", "message" -> "User already exists"))
        }
      }
    )
  }}
}
