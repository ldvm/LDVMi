package controllers.react

import play.api.mvc.{Action, Controller}
import scaldi.{Injectable, Injector}

class ApplicationController(implicit inj: Injector) extends Controller with Injectable {
  def index() = Action {
    Ok(views.html.react.main())
  }
}