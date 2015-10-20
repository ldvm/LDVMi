package controllers

import play.api.Routes
import play.api.mvc._
import scaldi.{Injectable, Injector}

class ApplicationController(implicit inj: Injector) extends Controller with Injectable {

  def index() = Action {
    Ok(views.html.angular.ldvm())
  }

}