package controllers.api

import play.api.Play.current
import play.api.db.slick._
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}

class VisualizerApiController(implicit inj: Injector) extends Controller with Injectable {

  def add(name: String, signature: String, url: String, description: Option[String] = None, title: Option[String] = None) = DBAction { implicit rs =>

    // val vid = visualizerService.insertAndGetId(Component(1, name, title, description, "input", None, url))
    val vid = 1
    Ok(JsObject(Seq(("id", JsNumber(vid)))))
  }

  def list(skip: Int = 0, take: Int = 10) = DBAction { implicit rs =>

    /*val count = visualizerService.count
    val entities = visualizerService.listWithEager(skip, take)*/

    Ok(JsObject(Seq()
      /*Seq(
        ("count", JsNumber(count)),
        ("data", Json.toJson(entities))
      )*/
    ))
  }

}
