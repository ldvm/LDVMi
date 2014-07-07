package controllers

import play.api._
import play.api.Play.current
import play.api.mvc._
import scaldi.{Injectable, Injector}

class DataCube(implicit inj: Injector) extends Controller with Injectable {

  def internal(id: Long) = Action {
    Ok(views.html.dataCube("Your new application is ready."))
  }

}