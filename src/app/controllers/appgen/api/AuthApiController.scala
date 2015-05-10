package controllers.appgen.api

import play.api.db
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}
import model.appgen.entity.{UserId, User}
import model.appgen.repository.UsersRepository
import play.api.Play.current

class AuthApiController(implicit inj: Injector) extends Controller with Injectable {

  val usersRepository = inject[UsersRepository]

  def signUp = Action(BodyParsers.parse.json) { request =>
    // TODO: move the implicit converter to the companion object
    // (how to modify implicit companion object?)
    implicit val userReads: Reads[User] = Json.reads[User]
    implicit val session = db.slick.DB.createSession()

    val b = request.body.validate[User]

    b.fold(
      errors => { BadRequest(Json.obj("status" -> "OK", "message" -> JsError.toFlatJson(errors))) },
      user => {
        val userId = usersRepository save user
        Ok(Json.obj("status" -> "OK", "id" -> userId))
      }
    )
  }
}
