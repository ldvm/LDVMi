package controllers.api

import java.util.UUID

import controllers.api.JsonImplicits._
import model.entity.{ComponentTemplate, ComponentTemplateId}
import model.service.GraphStoreProtocol
import play.api.Play.current
import play.api.db.slick.{DBAction, _}
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.mvc.{Action, Result}
import scaldi.{Injectable, Injector}
import scala.concurrent.Future
import scalaj.http.Base64
import scala.concurrent.ExecutionContext.Implicits.global


class ComponentTemplateApiController(implicit inj: Injector) extends ApiController with Injectable {

  val graphStore = inject[GraphStoreProtocol]

  def delete(componentTemplateId: Long) = DBAction { implicit rws =>
    withComponentTemplate(componentTemplateId) { ct =>
      componentTemplateService.delete(ct)
      Ok
    }
  }

  def list(skip: Int = 0, take: Int = 50) = DBAction { implicit rws =>

    val componentTemplates = componentTemplateService.findPaginated(skip, take)()
    val ids = componentTemplates.map(_.id.get)

    val specificTemplates = componentTemplateService.findSpecificIn(ids)

    val specific = componentTemplates.map { ct =>
      (specificTemplates.find(_.componentTemplateId == ct.id.get), ct)
    }

    val result = JsObject(Seq(
      "data" -> Json.toJson(specific),
      "count" -> JsNumber(componentTemplateService.countAll)
    ))

    Ok(result)
  }

  def findById(id: Long) = DBAction { implicit rws =>
    withComponentTemplate(id) { componentTemplate =>
      Ok(Json.toJson(componentTemplate))
    }
  }

  def featuresById(id: Long) = DBAction { implicit rws =>
    withComponentTemplate(id) { componentTemplate =>
      Ok(Json.toJson(componentTemplate.features))
    }
  }

  def inputsById(id: Long) = DBAction { implicit rws =>
    withComponentTemplate(id) { componentTemplate =>
      Ok(Json.toJson(componentTemplate.inputTemplates.map(_.dataPortTemplate)))
    }
  }

  def outputById(id: Long) = DBAction { implicit rws =>
    withComponentTemplate(id) { componentTemplate =>
      Ok(Json.toJson(componentTemplate.outputTemplate.map(_.dataPortTemplate)))
    }
  }

  def descriptorsById(id: Long) = DBAction { implicit rws =>
    withComponentTemplate(id) { componentTemplate =>
      Ok(Json.toJson(componentTemplate.features.flatMap(_.descriptors)))
    }
  }

  def makePermanent(id: Long) = DBAction { implicit rws =>
    withComponentTemplate(id) { componentTemplate =>
      componentTemplateService.save(componentTemplate.copy(isTemporary = false))
      Ok(JsObject(Seq()))
    }
  }

  def createSparqlEndpoints = DBAction { implicit rws =>

    case class Endpoint(url: String, graphUris: Option[Seq[String]])
    implicit val endpointReads = (
      (__ \ 'endpointUrl).read[String] and
        (__ \ 'graphUris).readNullable[Seq[String]]
      ) (Endpoint)

    rws.request.body.asJson.map { json =>
      val endpoints = json.as[Seq[Endpoint]]

      val ids = endpoints.flatMap { e =>
        dataSourceService.createDataSourceFromUris(e.url, e.graphUris)
      }

      ids.size match {
        case 0 => BadRequest
        case _ => Ok(JsArray(
          ids.map(id => JsObject(Seq("id" -> JsNumber(id.id))))
        ))
      }
    }.getOrElse(BadRequest)
  }

  def createFromUrls = DBAction { implicit rws =>

    rws.request.body.asJson.flatMap { json =>
      val urls = json.as[Seq[String]]
      val cleanUrls = urls.map(stripAll(_, "\n\r\t ,'\";"))
      val id = dataSourceService.createDataSourceFromRemoteTtl(cleanUrls)

      id.map(i => Ok(JsArray(Seq(JsObject(Seq("id" -> JsNumber(i.id)))))))

    }.getOrElse(BadRequest)
  }

  def createByFileUpload = Action.async(parse.json(100 * 1024 * 1024)) { implicit request =>

    case class File(filename: String, data: String)
    implicit val endpointReads = (
      (__ \ 'name).read[String] and
        (__ \ 'data).read[String]
      ) (File)


    Future {
      val files = request.body.as[Seq[File]]
      val fileContents = files.map(file => {
        val commaPosition = file.data.indexOf(",")
        val base64Content = file.data.substring(commaPosition + 1)
        (file.filename, Base64.decodeString(base64Content))
      })

      DB.withSession { implicit s =>
        val id = dataSourceService.createDataSourceFromStrings(fileContents, Some(UUID.randomUUID()))
        id.map(i => Ok(JsArray(Seq(JsObject(Seq("id" -> JsNumber(i.id))))))).getOrElse(BadRequest)
      }
    }
  }

  def stripAll(s: String, bad: String): String = {

    @scala.annotation.tailrec def start(n: Int): String =
      if (n == s.length) ""
      else if (bad.indexOf(s.charAt(n)) < 0) end(n, s.length)
      else start(1 + n)

    @scala.annotation.tailrec def end(a: Int, n: Int): String =
      if (n <= a) s.substring(a, n)
      else if (bad.indexOf(s.charAt(n - 1)) < 0) s.substring(a, n)
      else end(a, n - 1)

    start(0)
  }

  private def withComponentTemplate(id: Long)(func: ComponentTemplate => Result)(implicit session: Session): Result = {
    componentTemplateService.findById(ComponentTemplateId(id)).map(func)
  }.getOrElse {
    NotFound
  }
}