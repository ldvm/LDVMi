package controllers.api

import akka.actor._
import controllers.api.JsonImplicits._
import model.entity.{PipelineDiscoveryId, Pipeline, PipelineId}
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

  def list(skip: Int = 0, take: Int = 50, discoveryId: Option[Long] = None) = DBAction { implicit rws =>

    val pipelineDiscoveryId = discoveryId.map(PipelineDiscoveryId.apply)

    val result = JsObject(Seq(
      "data" -> Json.toJson(pipelineService.findPaginatedFiltered(skip, take, pipelineDiscoveryId)()),
      "count" -> JsNumber(pipelineService.countAll)
    ))

    Ok(result)
  }

  def discover = WebSocket.acceptWithActor[JsValue, JsValue] { request => out =>
    implicit val session = db.slick.DB.createSession()
    val actorProps = MyWebSocketActor.props(out)
    pipelineService.discover(out)
    session.close()
    actorProps
  }

  object MyWebSocketActor {
    def props(out: ActorRef) = Props(new MyWebSocketActor(out))
  }

  class MyWebSocketActor(out: ActorRef) extends Actor {
    def receive = {
      case msg: String =>
        out ! ("I received your message: " + msg)
    }
  }

  def pipelineToJson(pipeline: Pipeline)(implicit session: Session) = {
    val set = pipeline.bindingSet
    val components = set.componentInstances.zipWithIndex
    val nodes = components.sortBy(_._2).map { c =>
      JsObject(Seq(
        "name" -> JsString(c._1.title),
        "group" -> JsNumber(c._2)
      ))
    }

    println(set.bindings)

    val links = set.bindings.map { b =>
      val source = b.source.componentInstance
      val target = b.targetInputInstance.componentInstance

      JsObject(Seq(
        "target" -> JsNumber(components.find(_._1 == target).map(_._2).get),
        "source" -> JsNumber(components.find(_._1 == source).map(_._2).get)
      ))
    }

    JsObject(Seq(
      "nodes" -> JsArray(nodes),
      "links" -> JsArray(links)
    ))
  }
}