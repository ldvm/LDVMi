import play.api._
import services.RdfModule
import scaldi.play.ScaldiSupport

object Global extends GlobalSettings with ScaldiSupport {
  def applicationModule = new RdfModule :: new WebModule
}