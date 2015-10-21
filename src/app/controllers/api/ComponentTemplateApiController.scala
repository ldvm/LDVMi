package controllers.api

import controllers.api.JsonImplicits._
import model.entity.{ComponentTemplate, ComponentTemplateId}
import play.api.Play.current
import play.api.db.slick.{DBAction, _}
import play.api.mvc.Result
import scaldi.{Injectable, Injector}
import play.api.libs.json._
import play.api.libs.functional.syntax._

class ComponentTemplateApiController(implicit inj: Injector) extends ApiController with Injectable {

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

  def addDatasource = DBAction { implicit rws =>

    case class Endpoint(url: String, graphUris: Option[Seq[String]])
    implicit val endpointReads = (
        (__ \ 'url).read[String] and
        (__ \ 'graphUris).readNullable[Seq[String]]
      )(Endpoint)

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

  private def withComponentTemplate(id: Long)(func: ComponentTemplate => Result)(implicit session: Session): Result = {
    componentTemplateService.findById(ComponentTemplateId(id)).map(func)
  }.getOrElse {
    NotFound
  }
}