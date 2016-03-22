package controllers.appgen

import model.appgen.entity.ApplicationId
import model.appgen.repository.ApplicationsRepository
import model.appgen.service.VisualizerService
import scaldi.{Injector, Injectable}
import play.api.mvc.{Action, Controller}
import play.api.db.slick._
import play.api.Play.current
import views.appgen.AppView

class AppController(implicit inj: Injector) extends Controller with Injectable {
  val applicationsRepository = inject[ApplicationsRepository]
  val visualizerService = inject[VisualizerService]

  def index(id: Long, uid: String, any: Any) = Action {
    DB.withSession { implicit session =>
      // TODO: check for the user
      (for {
        application <- applicationsRepository.findById(ApplicationId(id))
        visualizer <- visualizerService.getVisualizer(application)
        view <- AppView.get(visualizer.uri)
      } yield (application, visualizer, view)) match {
        case Some((application, visualizer, view)) => Ok(view)
        case _ => Redirect("/appgen/app-not-found")
      }
    }
  }
}
