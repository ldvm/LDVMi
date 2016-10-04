package controllers.assistant.api.rest

import model.assistant.entity.User
import model.assistant.rest.Response._
import model.assistant.rest.RestRequest
import model.assistant.service.UserService
import play.api.Play.current
import play.api.db.slick.{Session, _}
import play.api.libs.json.{JsValue, Reads}
import play.api.mvc._
import scaldi.{Injectable, Injector}

abstract class BaseRestController(implicit inj: Injector) extends Controller with Injectable {

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
  protected def BaseRestAction[T, U]
    (request: Request[JsValue])
    (convert: Result => U)
    (action: RestRequest => T => U)
    (implicit jsonReads: Reads[T]): U = {

    // Validate JSON body using provided reader
    jsonReads.reads(request.body).fold(
      errors => convert(BadRequest(InvalidJsonResponse(errors))),
      json => {
        DB.withSession { implicit dbSession =>
          action(RestRequest(dbSession, authenticate(request), request))(json)
        }
      })
  }
}
