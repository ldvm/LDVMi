package controllers.assistant.api.rest

import model.assistant.entity.User
import model.assistant.rest.Response._
import model.assistant.rest.RestRequestWithUser
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json.{JsValue, Reads}
import play.api.mvc._
import scaldi.{Injectable, Injector}

import scala.concurrent.Future

abstract class SecuredRestController(implicit inj: Injector) extends BaseRestController with Injectable {

  // Implicit conversion from RestRequest to Session
  implicit def session[T](implicit request: RestRequestWithUser) = request.dbSession

  private def BaseSecuredRestAction[T, U]
    (request: Request[JsValue])
    (convert: Result => U)
    (action: RestRequestWithUser => T => U)
    (implicit jsonReads: Reads[T]): U = {
      BaseRestAction[T, U](request)(convert) { implicit request => json =>
        request.user match {
          case Some(user: User) => action(RestRequestWithUser(request.dbSession, user, request))(json)
          case None => convert(Unauthorized(ErrorResponse("Forbidden access. Please sign in.")))
        }
      }
  }

  def RestAction[T](action: RestRequestWithUser => T => Result)(implicit jsonReads: Reads[T])
    = Action(BodyParsers.parse.json) { request =>
    BaseSecuredRestAction[T, Result](request)(result => result)(action)
  }

  def RestAsyncAction[T](action: RestRequestWithUser => T => Future[Result])(implicit jsonReads: Reads[T])
    = Action.async(BodyParsers.parse.json) { request =>
    BaseSecuredRestAction[T, Future[Result]](request)(result => Future(result))(action)
  }
}
