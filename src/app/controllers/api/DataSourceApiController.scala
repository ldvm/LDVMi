package controllers.api

import java.util.UUID

import play.api.db.slick._
import play.api.libs.json.{JsObject, JsNumber}
import play.api.mvc.Action
import scaldi.{Injectable, Injector}
import play.api.Play.current

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

class DataSourceApiController(implicit inj: Injector) extends ApiController with Injectable {

  def fromFile = Action.async(parse.maxLength(100 * 1024 * 1024, parse.multipartFormData)) { request =>
    Future {
      request.body.fold({ ms =>
        BadRequest
      }, { body =>

        DB.withSession { implicit s =>
          val files = body.files.filter(_.key == "file")
          val uuid = body
            .dataParts
            .get("uuid")
            .flatMap(_.headOption.map(UUID.fromString))

          val maybeDataSourceId = dataSourceService.createDataSourceFromFiles(files, uuid)

          maybeDataSourceId.map { i =>
            Ok(JsObject(Seq(("id",JsNumber(maybeDataSourceId.map(_.id).get)))))
          }.getOrElse {
            BadRequest
          }
        }

      })
    }
  }
}
