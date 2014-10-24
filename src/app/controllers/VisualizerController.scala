package controllers

import play.api.mvc._
import scaldi.{Injectable, Injector}

class VisualizerController(implicit inj: Injector) extends Controller with Injectable {

  def index() = Action {
    Ok(views.html.angular.visualizers())
  }

}