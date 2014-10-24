package controllers.api

import play.api.Play.current
import play.api.db.slick._
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}

class VisualizerApiController(implicit inj: Injector) extends Controller with Injectable {

  def add(name: String, signature: String, description: Option[String]) = DBAction { implicit rs =>
    //val vid = visualizationService.insertAndGetId(Visualization(2, name.getOrElse("anonymous"), dataDataSource, dsdDataSource))

    Ok(JsObject(Seq(("id", JsNumber(1)))))
  }

  def list(skip: Int = 0, take: Int = 10) = DBAction { implicit rs =>

    //val count = visualizationService.count

    //visualizationService.listWithEager(skip, take)

    Ok(JsObject(
      Seq(
        ("count", JsNumber(0))//,
        //("data", Json.toJson(List()))
      )
    ))
  }

}
