package controllers

import play.api.mvc._
import scaldi.{Injectable, Injector}

class DataCubeController(implicit inj: Injector) extends Controller with Injectable {

  def visualize = Action {
    Ok(views.html.dataCube(""))
  }

}