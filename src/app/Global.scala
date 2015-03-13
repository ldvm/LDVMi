import java.util.concurrent.TimeUnit

import controllers.ControllerModule
import controllers.api.ApiModule
import play.api._
import play.api.libs.concurrent.Akka
import play.api.mvc.WithFilters
import play.filters.gzip.GzipFilter
import scaldi.play.ScaldiSupport
import model.rdf.RdfModule
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Play.current

import scala.concurrent.duration.Duration

object Global extends WithFilters(
  new GzipFilter(
    shouldGzip = (request, response) => response.headers.get("Content-Type").exists(
      t => t.startsWith("text/html") || t.startsWith("application/json")
    )
  )
) with ScaldiSupport with GlobalSettings {
  def applicationModule = new RepositoryModule :: new ServiceModule :: new RdfModule :: new ControllerModule :: new ApiModule

  override def onStart(app: Application) = {
    super.onStart(app)

    Akka.system.scheduler.schedule(Duration.create(10, TimeUnit.MINUTES), Duration.create(2, TimeUnit.HOURS)) {
      //run automated discovery
    }
  }
}