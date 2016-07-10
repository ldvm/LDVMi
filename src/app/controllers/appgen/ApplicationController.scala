package controllers.appgen

import java.nio.file.{Files, Paths}

import model.appgen.entity.ApplicationId
import model.appgen.repository.ApplicationsRepository
import model.appgen.service.VisualizerService
import scaldi.{Injectable, Injector}
import play.api.mvc.{Action, Controller}
import play.api.db.slick._
import play.api.Play.current
import play.api.Play.resource

class ApplicationController(implicit inj: Injector) extends Controller with Injectable {
  val applicationsRepository = inject[ApplicationsRepository]
  val visualizerService = inject[VisualizerService]

  def index(id: Long, uid: String, any: Any) = Action {
    DB.withSession { implicit session =>
      // The user is verified on the client side.

      (for {
        application <- applicationsRepository.findById(ApplicationId(id))
        visualizer <- visualizerService.getVisualizer(application)
      } yield {
        // If the app's uid has changed, let's redirect it to the correct url.
        if (application.uid != uid) {
          val url = routes.ApplicationController.index(id, application.uid, if (any != null) any.toString else null).url
          MovedPermanently(url)
        } else {
          val baseUrl = routes.ApplicationController.index(id, uid, null).url
          val bundleName = visualizer.name

          if (!bundleExists(bundleName)) {
            InternalServerError(views.html.appgen.error(
              "JavaScript bundle '" + bundleName + "' does not exist",
              "Is the bundle name correct? Have you created the bundle entry point?"))
          } else {
            Ok(views.html.appgen.reactView(
              application.name + " | LinkedPipes Application Generator",
              application.description.getOrElse(""),
              bundleName, baseUrl, application.id.get.id))
          }
        }
      }) getOrElse Redirect("/appgen/app-not-found")
    }
  }

  private def bundleExists(bundleName: String): Boolean = {
    if (play.Play.isDev) {
      val bundlePath = Paths.get("app/assets_webpack/appgen/javascripts/entries/" + bundleName + ".js")
      Files.exists(bundlePath)
    } else {
      resource("/public/javascripts/appgen/" + bundleName + ".bundle.js").isDefined
    }
  }
}
