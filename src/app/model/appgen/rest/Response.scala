package model.appgen.rest

import play.api.data.validation.ValidationError
import play.api.libs.json.Json.JsValueWrapper
import play.api.libs.json._

object Response {
  def SuccessResponse(message: String = "", data: Seq[(String, JsValueWrapper)]) : JsObject = {
    Json.obj("status" -> "success", "message" -> message, "data" -> Json.obj(data:_*))
  }

  def ErrorResponse(message: String = "", data: Seq[(String, JsValueWrapper)]) : JsObject = {
    Json.obj("status" -> "error", "message" -> message, "data" -> Json.obj(data:_*))
  }

  def InvalidJsonResponse(errors: Seq[(JsPath, Seq[ValidationError])]) : JsObject = {
    ErrorResponse("Invalid json", Seq("errors" -> JsError.toFlatJson(errors)))
  }
}
