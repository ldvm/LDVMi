package controllers.assistant

import play.api.mvc.{Action, Controller}
import scaldi.{Injectable, Injector}

class PlatformController(implicit inj: Injector) extends Controller with Injectable {
  def index(any: Any) = Action {
    val baseUrl = routes.PlatformController.index("").url
    Ok(views.html.assistant.reactView(
      title = "LinkedPipes Visualization Assistant",
      description = "Welcome to LinkedPipes Visualization Assistant.",
      bundleName = "platform", baseUrl = baseUrl))
  }
}
