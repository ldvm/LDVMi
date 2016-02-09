import java.security.{cert, SecureRandom}
import javax.net.ssl._
import controllers.ControllerModule
import controllers.api.ApiModule
import model.rdf.RdfModule
import play.api._
import play.api.mvc.WithFilters
import play.filters.gzip.GzipFilter
import scaldi.play.ScaldiSupport
import collection.JavaConversions._



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

    val trustAll = java.util.Arrays.asList(new X509TrustManager {
      override def checkClientTrusted(x509Certificates: Array[cert.X509Certificate], s: String): Unit = {}

      override def checkServerTrusted(x509Certificates: Array[cert.X509Certificate], s: String): Unit = {}

      override def getAcceptedIssuers: Array[cert.X509Certificate] = null
    }).toArray

    try {
      val sc = SSLContext.getInstance("TLS")
      sc.init(null, trustAll.asInstanceOf[Array[TrustManager]], new SecureRandom())
      HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory)
    } catch {case e: Throwable => }
  }
}