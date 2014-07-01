package controllers

import play.api._
import play.api.mvc._

object DataCube extends Controller {

  def cached(cacheId: String) = Action {
    Ok(views.html.index("Your new application is ready."))
  }

}