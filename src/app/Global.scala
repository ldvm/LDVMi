import controllers.ControllerModule
import controllers.api.ApiModule
import model.repository._
import play.api._
import play.api.db.DB
import play.api.libs.concurrent.Akka
import play.api.mvc.WithFilters
import play.filters.gzip.GzipFilter
import scaldi.play.ScaldiSupport
import model.rdf.RdfModule
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Play.current
import scala.concurrent.duration._

import scala.slick.driver.H2Driver.simple._


object Global extends WithFilters(
  new GzipFilter(
    shouldGzip = (request, response) => response.headers.get("Content-Type").exists(
      t => t.startsWith("text/html") || t.startsWith("application/json")
    )
  )
) with ScaldiSupport with GlobalSettings {
  val services = new ServiceModule
  def applicationModule = new RepositoryModule :: services :: new RdfModule :: new ControllerModule :: new ApiModule

  override def onStart(app: Application) = {
    super.onStart(app)

    lazy val database = Database.forDataSource(DB.getDataSource())
    lazy val session = database.createSession()

    Akka.system.scheduler.schedule(0.microsecond, 2.minutes) {
      val expiredHours = 72
      (new PipelineRepository).deleteExpired(expiredHours)(session)
      (new DataPortBindingSetRepository).cleanup(session)
      (new ComponentInstanceMembershipRepository).cleanup(session)
      (new ComponentInstanceRepository).cleanup(session)
      (new ComponentTemplateRepository).deleteExpired(expiredHours)(session)
    }
  }
}