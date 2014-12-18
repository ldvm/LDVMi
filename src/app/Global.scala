import controllers.ControllerModule
import controllers.api.ApiModule
import play.api._
import play.api.mvc.WithFilters
import play.filters.gzip.GzipFilter
import scaldi.play.ScaldiSupport
import model.rdf.RdfModule

object Global extends WithFilters(
  new GzipFilter(
    shouldGzip = (request, response) => response.headers.get("Content-Type").exists(
      t => t.startsWith("text/html") || t.startsWith("application/json")
    )
  )
) with ScaldiSupport with GlobalSettings {
  def applicationModule = new RepositoryModule :: new ServiceModule :: new RdfModule :: new ControllerModule :: new ApiModule
}