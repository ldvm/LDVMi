package controllers.api

import model.dao.Visualizer
import model.services.VisualizerService
import play.api.Play.current
import play.api.db.slick._
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}

class VisualizerApiController(implicit inj: Injector) extends Controller with Injectable {

  val visualizerService = inject[VisualizerService]

  def add(name: String, signature: String, url: String, description: Option[String] = None, dsdSignature: Option[String] = None) = DBAction { implicit rs =>

    val vid = visualizerService.insertAndGetId(Visualizer(1, name, signature, url, description, dsdSignature))

    Ok(JsObject(Seq(("id", JsNumber(vid)))))
  }

  def list(skip: Int = 0, take: Int = 10) = DBAction { implicit rs =>

    val count = visualizerService.count
    val entities = visualizerService.listWithEager(skip, take)

    Ok(JsObject(
      Seq(
        ("count", JsNumber(count)),
        ("data", Json.toJson(entities))
      )
    ))
  }

}
