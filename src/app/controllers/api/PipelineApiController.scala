package controllers.api

import controllers.api.JsonImplicits._
import model.entity._
import model.service.PipelineService
import play.api.Play.current
import play.api.db.slick._
import play.api.libs.json._
import play.api.mvc.Controller
import scaldi.{Injectable, Injector}
import utils.PaginationInfo
import CustomUnicornPlay.driver.simple._

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
      "data" -> Json.toJson(pipelineService.lastEvaluations(pipelineId, PaginationInfo(skip, take)))
    ))

    Ok(result)
  }

  def list(skip: Int = 0, take: Int = 50, discoveryId: Option[Long] = None, visualizerId: Option[Long] = None, onlyPermanent: Option[Boolean] = None) = DBAction { implicit rws =>

    val pipelineDiscoveryId = discoveryId.map(PipelineDiscoveryId.apply)
    val visualizerTemplateId = visualizerId.map(ComponentTemplateId.apply)

    val pipelinesPage = pipelineService.findPaginatedFiltered(PaginationInfo(skip, take), pipelineDiscoveryId, visualizerTemplateId, onlyPermanent.getOrElse(false))(
      e => {
        val priorities = e.visualizationConfiguration.map(_.priority)
        val sum = priorities.sum
        (sum, e.modifiedUtc.desc, e.createdUtc.desc)
      }
    )

    val result = JsObject(Seq(
      "data" -> Json.toJson(pipelinesPage),
      "count" -> JsNumber(pipelineService.countAll)
    ))

    Ok(result)
  }

  def discover(dataSourceTemplateIds: List[Long], combine: Boolean = false) = withWebSocket { logger => implicit session =>
    pipelineService.discover(logger, dataSourceTemplateIds, combine)
  }

  def evaluate(id: Long) = withWebSocket { logger => implicit session =>
    pipelineService.evaluate(PipelineId(id))(logger)
  }

  def makePermanent(id: Long) = DBAction { implicit rws =>
    val pipelineId = PipelineId(id)
    pipelineService.makePermanent(pipelineId)
    Ok(JsObject(Seq()))
  }

  def getSingle(discoveryId: Long) = DBAction { implicit rws =>
    val id = PipelineDiscoveryId(discoveryId)
    val pipelinesPage = pipelineService.findPaginatedFiltered(PaginationInfo(0, 1), Some(id))(
      e => {
        val priorities = e.visualizationConfiguration.map(_.priority)
        val sum = priorities.sum
        (sum, e.modifiedUtc.desc, e.createdUtc.desc)
      }
    )
    Ok(Json.toJson(pipelinesPage.headOption))
  }

  def pipelineToJson(pipeline: Pipeline)(implicit session: Session) = {
    val set = pipeline.bindingSet

    val components = JsArray(pipeline.componentInstances.map { ci =>
      JsObject(Seq(
        "id" -> JsNumber(ci.id.get.id),
        "uri" -> JsString(ci.uri),
        "label" -> JsString(ci.title),
        "htmlContent" -> JsString(ci.description.getOrElse("")),
        "type" -> JsString(ci.getType.toString.toLowerCase),
        "inputs" -> JsArray(ci.inputInstances.map { ii =>
          JsObject(Seq(
            "id" -> JsNumber(ii.id.get.id),
            "uri" -> JsString(ii.dataPortInstance.uri),
            "label" -> JsString(ii.dataPortInstance.title)
          ))
        }),
        "outputs" -> JsArray(ci.outputInstance.map { oi =>
          JsObject(Seq(
            "id" -> JsNumber(oi.id.get.id),
            "uri" -> JsString(oi.dataPortInstance.uri),
            "label" -> JsString(oi.dataPortInstance.title)
          ))
        }.toSeq)
      ))
    })

    val links = JsArray(set.bindings.map { b =>
      val source = b.source
      val target = b.targetInputInstance.map(_.dataPortInstance).get

      JsObject(Seq(
        "targetId" -> JsNumber(target.id.get.id),
        "sourceId" -> JsNumber(source.id.get.id),
        "targetUri" -> JsString(target.uri),
        "sourceUri" -> JsString(source.uri),
        "type" -> JsString("resolved")
      ))
    })

    JsObject(Seq(
      "components" -> components,
      "bindings" -> links
    ))
  }
}