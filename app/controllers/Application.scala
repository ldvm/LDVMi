package controllers

import play.api._
import play.api.mvc._
import scaldi.{Injectable, Injector}

class Application(implicit inj: Injector) extends Controller with Injectable {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

}