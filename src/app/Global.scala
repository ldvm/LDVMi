import play.api._
import play.api.mvc.WithFilters
import play.filters.gzip.GzipFilter
import scaldi.play.ScaldiSupport
import services.data.DataModule
import services.data.rdf.RdfModule

object Global extends WithFilters(
  new GzipFilter(
    shouldGzip = (request, response) => response.headers.get("Content-Type").exists(
      t => t.startsWith("text/html") || t.startsWith("application/json")
    )
  )
) with ScaldiSupport with GlobalSettings {
  def applicationModule = new DataModule :: new RdfModule :: new WebModule
}