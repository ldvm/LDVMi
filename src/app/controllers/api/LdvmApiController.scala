package controllers.api

import model.entity.CustomUnicornPlay
import model.service.LdvmService
import play.api.db.slick.DBAction
import play.api.libs.json._
import play.api.mvc.Controller
import scaldi.{Injectable, Injector}
import play.api.db.slick._

class LdvmApiController(implicit inj: Injector) extends Controller with Injectable {

  val ldvmService = inject[LdvmService]

  def ttl = DBAction(parse.multipartFormData) { implicit rs =>

    val uploadedFile = rs.request.body.file("file")
    uploadedFile.map { ttlFile =>

      ldvmService.fromRdf(ttlFile.ref.file) match {
        case (maybeComponentIds, maybePipelineIds) => {
          Ok(JsObject(Seq(
            ("components", toJsVal(maybeComponentIds)),
            ("pipelines", toJsVal(maybePipelineIds))
          )))
        }
        case _ => NotAcceptable
      }

    }.getOrElse {
      NotAcceptable
    }
  }

  private def toJsVal(listOption: Option[Seq[CustomUnicornPlay.BaseId]]): JsValue = {
    listOption match {
      case Some(list) => JsArray(list.map(typedId => JsNumber(typedId.id)))
      case None => JsNull
    }
  }

}
