import java.io.FileInputStream
import java.security.KeyStore
import java.security.cert.X509Certificate
import javax.net.ssl.{SSLContext, X509TrustManager, TrustManagerFactory}
import javax.security.cert.{CertificateException}

import controllers.ControllerModule
import controllers.api.ApiModule
import model.appgen.repository.AppgenRepositoryModule
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

  // TODO: The services line should be back in the def definition as this way, it's initialized
  // immediately and breaks the only test we have (via Injector).
  def applicationModule = new RepositoryModule :: services :: new RdfModule :: new
      ControllerModule :: new ApiModule :: new AppgenRepositoryModule

  override def onStart(app: Application) = {
    super.onStart(app)

    loadCustomTrustStore(app)

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

  private def loadCustomTrustStore(app: Application): Unit ={
    val trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm)
    // Using null here initialises the TMF with the default trust store.
    trustManagerFactory.init(null.asInstanceOf[KeyStore])

    // Get hold of the default trust manager
    val defaultTm = trustManagerFactory.getTrustManagers.find(_.isInstanceOf[X509TrustManager]).map(_.asInstanceOf[X509TrustManager]).orNull

    val myKeys = app.classloader.getResourceAsStream("clientkeystore")

    // Do the same with your trust store this time
    // Adapt how you load the keystore to your needs
    val myTrustStore = KeyStore.getInstance(KeyStore.getDefaultType)
    myTrustStore.load(myKeys, "!$^!Y[N3G~r9k6k^T+/3~&EDJ".toCharArray)

    myKeys.close()

    val tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm)
    tmf.init(myTrustStore)

    val myTm = tmf.getTrustManagers.find(_.isInstanceOf[X509TrustManager]).map(_.asInstanceOf[X509TrustManager]).orNull

    // Wrap it in your own class.
    val finalDefaultTm = defaultTm
    val finalMyTm = myTm

    val customTm = new X509TrustManager() {
      @Override
      def getAcceptedIssuers = finalDefaultTm.getAcceptedIssuers

      @Override
      def checkServerTrusted(chain: Array[X509Certificate], authType: String) {
        try {
          finalMyTm.checkServerTrusted(chain, authType)
        } catch {
          // This will throw another CertificateException if this fails too.
          case e: CertificateException => finalDefaultTm.checkServerTrusted(chain, authType)
        }
      }

      @Override
      def checkClientTrusted(chain: Array[X509Certificate], authType: String) {
        // If you're planning to use client-cert auth,
        // do the same as checking the server.
        finalDefaultTm.checkClientTrusted(chain, authType);
      }
    }


    var sslContext = SSLContext.getInstance("TLS")
    sslContext.init(null, Seq(customTm).toArray, null)

    // You don't have to set this as the default context,
    // it depends on the library you're using.
    SSLContext.setDefault(sslContext)
  }
}