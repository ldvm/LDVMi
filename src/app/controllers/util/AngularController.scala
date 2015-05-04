package controllers.util

import play.api.mvc._
import scaldi.{Injectable, Injector}

class AngularController(implicit inj: Injector) extends Controller with Injectable {

  def requireMain(ngAppName: String) = Action {
    Ok(views.html.angular.util.require.render(ngAppName)).as("application/javascript")
  }

  def layoutController(ngAppName: String) = Action {
    Ok(views.html.angular.util.layoutController.render(ngAppName)).as("application/javascript")
  }

  def controllersModule(ngAppName: String) = Action {
    Ok(views.html.angular.util.controllersModule.render(ngAppName)).as("application/javascript")
  }

}
