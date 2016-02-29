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
import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.Future

sealed case class RestRequest(val dbSession: Session,
                              val user: User,
                              private val request: Request[JsValue])
  extends WrappedRequest(request)

abstract class RestController(implicit inj: Injector) extends Controller with Injectable {

  val userService = inject[UserService]

  // Implicit conversion from RestRequest to Session
  implicit def session[T](implicit request: RestRequest) = request.dbSession

  def authenticate(request: Request[JsValue])(implicit session: Session): Option[User] = {
    for {
      // Use email stored in the session to load current user
      email <- request.session.get("userEmail")
      user <- userService.find(email)
    } yield user
  }

  /**
    * Base action that
    * (1) parses the request into case class
    * (2) creates db connection and
    * (3) authenticates the user.
    * It supports both sync and async actions using the convert function.
    * @param request preprocessed HTTP request with JsValue body
    * @param convert converts result into the desired type, either Result or Future[Result]
    * @param action the action itself that produces the request result
    * @param jsonReads implicit json reads to convert request into the case class
    * @tparam T case class defining the Json scheme
    * @tparam U result type, either Result or Future
    * @return the actual result of the result.
    */
  private def BaseRestAction[T, U]
    (request: Request[JsValue])
    (convert: Result => U)
    (action: RestRequest => T => U)
    (implicit jsonReads: Reads[T]): U = {

    // Validate JSON body using provided reader
    jsonReads.reads(request.body).fold(
      errors => convert(BadRequest(InvalidJsonResponse(errors))),
      json => {
        DB.withSession { implicit dbSession =>
          authenticate(request) match {
            case Some(user: User) => action(RestRequest(dbSession, user, request))(json)
            case None => convert(Unauthorized(ErrorResponse("Forbidden access. Please sign in.")))
          }
        }
      })
  }

  def RestAction[T](action: RestRequest => T => Result)(implicit jsonReads: Reads[T])
    = Action(BodyParsers.parse.json) { request =>
    BaseRestAction[T, Result](request)(result => result)(action)
  }

  def RestAsyncAction[T](action: RestRequest => T => Future[Result])(implicit jsonReads: Reads[T])
    = Action.async(BodyParsers.parse.json) { request =>
    BaseRestAction[T, Future[Result]](request)(result => Future(result))(action)
  }
}
