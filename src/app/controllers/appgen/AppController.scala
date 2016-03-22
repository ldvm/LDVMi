package controllers.appgen

import model.appgen.entity.ApplicationId
import model.appgen.repository.ApplicationsRepository
import scaldi.{Injector, Injectable}
import play.api.mvc.{Action, Controller}
import play.api.db.slick._
import play.api.Play.current

class AppController(implicit inj: Injector) extends Controller with Injectable {
  val applicationsRepository = inject[ApplicationsRepository]

  def index(id: Long, uid: String, any: Any) = Action {
    DB.withSession { implicit session =>
      applicationsRepository.findById(ApplicationId(id)) match {
        case Some(application) => Ok(views.html.appgen.platform())
        case None => Redirect("/appgen/app-not-found")
      }
    }
  }
}
