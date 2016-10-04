package controllers.assistant.api.rest

import model.assistant.rest.RestRequest
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json.Reads
import play.api.mvc._
import scaldi.{Injectable, Injector}

import scala.concurrent.Future

abstract class RestController(implicit inj: Injector) extends BaseRestController with Injectable {

  def RestAction[T](action: RestRequest => T => Result)(implicit jsonReads: Reads[T])
    = Action(BodyParsers.parse.json) { request =>
    BaseRestAction[T, Result](request)(result => result)(action)
  }

  def RestAsyncAction[T](action: RestRequest => T => Future[Result])(implicit jsonReads: Reads[T])
    = Action.async(BodyParsers.parse.json) { request =>
    BaseRestAction[T, Future[Result]](request)(result => Future(result))(action)
  }
}
