package controllers.appgen

import play.api.mvc.{Action, Controller}
import scaldi.{Injectable, Injector}

class PlatformController(implicit inj: Injector) extends Controller with Injectable {
  def index(any: Any) = Action {
    val baseUrl = routes.PlatformController.index("").url
    Ok(views.html.appgen.platform(baseUrl))
  }
}
