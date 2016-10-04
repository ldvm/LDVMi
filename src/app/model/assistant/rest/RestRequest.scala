package model.assistant.rest

import model.assistant.entity.User
import play.api.db.slick.Session
import play.api.libs.json.JsValue
import play.api.mvc._

sealed case class RestRequest(
  dbSession: Session,
  user: Option[User],
  private val request: Request[JsValue]) extends WrappedRequest(request)


