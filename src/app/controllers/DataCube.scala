package controllers

import play.api._
import play.api.Play.current
import play.api.mvc._
import scaldi.{Injectable, Injector}

class DataCube(implicit inj: Injector) extends Controller with Injectable {

  def visualize = Action {
    Ok(views.html.dataCube(""))
  }

}