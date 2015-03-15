package controllers.api

import akka.actor._
import controllers.api.JsonImplicits._
import controllers.api.ProgressReporter._
import model.entity.{ComponentTemplateId, PipelineDiscoveryId, Pipeline, PipelineId}
import model.service.PipelineService
import play.api.db
import play.api.db.slick._
import play.api.libs.json._
import play.api.mvc.{WebSocket, Controller}
import scaldi.{Injectable, Injector}
import play.api.Play.current

class PipelineApiController(implicit inj: Injector) extends Controller with Injectable {

  val pipelineService = inject[PipelineService]

  def findById(id: Long) = DBAction { implicit rws =>
    pipelineService.findById(PipelineId(id)).map { pipeline =>
      Ok(Json.toJson(pipeline))
    }.getOrElse {
      NotFound
    }
  }

  def visualizationById(id: Long) = DBAction { implicit rws =>
    pipelineService.findById(PipelineId(id)).map { pipeline =>
      Ok(pipelineToJson(pipeline))
    }.getOrElse {
      NotFound
    }
  }

  def evaluations(id: Long, skip: Int = 0, take: Int = 50) = DBAction { implicit rws =>

    val pipelineId = PipelineId(id)

    val result = JsObject(Seq(
      "data" -> Json.toJson(pipelineService.lastEvaluations(pipelineId, skip, take))
    ))

    Ok(result)
  }

  def list(skip: Int = 0, take: Int = 50, discoveryId: Option[Long] = None, visualizerId: Option[Long] = None) = DBAction { implicit rws =>

    val pipelineDiscoveryId = discoveryId.map(PipelineDiscoveryId.apply)
    val visualizerTemplateId = visualizerId.map(ComponentTemplateId.apply)

    val result = JsObject(Seq(
      "data" -> Json.toJson(pipelineService.findPaginatedFiltered(skip, take, pipelineDiscoveryId, visualizerTemplateId)()),
      "count" -> JsNumber(pipelineService.countAll)
    ))

    Ok(result)
  }

  def discover(endpointUrl: Option[String] = None, graphUris: Option[String] = None, combine: Boolean = false) =  withWebSocket { logger => implicit session =>
    pipelineService.discover(logger, endpointUrl.map { u => (u, graphUris.map(_.split("\n")).toSeq.flatten) }, combine)
  }

  def evaluate(id: Long) = withWebSocket { logger => implicit session =>
    pipelineService.evaluate(PipelineId(id))(logger)
  }

  def pipelineToJson(pipeline: Pipeline)(implicit session: Session) = {
    val set = pipeline.bindingSet

    val links = set.bindings.map { b =>
      val source = b.source.componentInstance
      val target = b.targetInputInstance.map(_.componentInstance)

      JsObject(Seq(
        "target" -> JsString(target.get.componentTemplate.title + " ["+target.get.id.map(_.id.toString).get+"]"),
        "source" -> JsString(source.componentTemplate.title + " ["+source.id.map(_.id.toString).get+"]"),
        "type" -> JsString("resolved")
      ))
    }

    JsArray(links)
  }
}