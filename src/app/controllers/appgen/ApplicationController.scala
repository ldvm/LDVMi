package controllers.appgen

import model.appgen.entity.ApplicationId
import model.appgen.repository.ApplicationsRepository
import model.appgen.service.VisualizerService
import scaldi.{Injector, Injectable}
import play.api.mvc.{Action, Controller}
import play.api.db.slick._
import play.api.Play.current

class ApplicationController(implicit inj: Injector) extends Controller with Injectable {
  val applicationsRepository = inject[ApplicationsRepository]
  val visualizerService = inject[VisualizerService]

  def index(id: Long, uid: String, any: Any) = Action {
    DB.withSession { implicit session =>
      // The user is verified on the client side.

      val baseUrl = routes.ApplicationController.index(id, uid, null).url

      (for {
        application <- applicationsRepository.findById(ApplicationId(id))
        visualizer <- visualizerService.getVisualizer(application)
      } yield (application, visualizer)) match {
        case Some((application, visualizer)) =>
          // If the app's uid has changed, let's redirect it to the correct url.
          if (application.uid != uid) {
            val url = routes.ApplicationController.index(id, application.uid, if (any != null) any.toString else null).url
            MovedPermanently(url)
          } else
            Ok(views.html.appgen.application(visualizer.name, baseUrl, application.id.get.id))
        case _ => Redirect("/appgen/app-not-found")
      }
    }
  }
}
