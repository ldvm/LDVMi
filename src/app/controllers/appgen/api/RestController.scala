package controllers.appgen.api

import model.appgen.entity.User
import model.appgen.service.UserService
import play.api.libs.json.{Reads, JsValue}
import play.api.mvc._
import play.api.db.slick.Session
import play.api.db.slick._
import play.api.Play.current
import scaldi.{Injectable, Injector}
import model.appgen.rest.Response._

sealed case class RestRequest(val dbSession: Session,
                              val user: User,
                              private val request: Request[JsValue])
  extends WrappedRequest(request)

class RestController(implicit inj: Injector) extends Controller with Injectable {

  val userService = inject[UserService]

  // Implicit conversion from RestRequest to Session
  implicit def session[T](implicit request: RestRequest) = request.dbSession

  def RestAction[T](action: RestRequest => T => Result)(implicit jsonReads: Reads[T]) = Action(BodyParsers.parse.json) { request =>

    // Validate JSON body using provided reader
    jsonReads.reads(request.body).fold(
      errors => BadRequest(InvalidJsonResponse(errors)),
      json => {
        DB.withSession { implicit dbSession =>

          // Use email stored in the session to load current user
          (for {
            email <- request.session.get("userEmail")
            user <- userService.find(email)
          } yield user) match {
            case Some(user: User) => action(RestRequest(dbSession, user, request))(json)
            case None => Unauthorized(ErrorResponse("Forbidden access. Please sign in."))
          }
        }
      })
  }
}
