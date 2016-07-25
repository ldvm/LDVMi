package model.appgen.service

import model.appgen.entity.{InstallResult, UserId}
import model.service.{DataSourceService, LdvmService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

import sys.process._
import java.net.URL
import java.io.File

import model.appgen.InstallBundle
import model.appgen.rest.UpdateVisualizerRequest.UpdateVisualizerRequest
import model.repository.ComponentTemplateRepository

import scala.util.{Failure, Success}

class InstallService(implicit inj: Injector) extends Injectable {
  val ldvmService = inject[LdvmService]
  val dataSourceService = inject[DataSourceService]
  val userDataSourcesService = inject[UserDataSourcesService]
  val visualizerService = inject[VisualizerService]
  val componentTemplateRepository = inject[ComponentTemplateRepository]

  def install(implicit session: Session) = {
    (InstallBundle.ldvmComponents map installLdvmComponent) :::
    (InstallBundle.dataSources map installDataSource) :::
    (InstallBundle.visualizers map installVisualizer)
  }

  private def installLdvmComponent(component: (String, String))(implicit session: Session) = {
    // Download a TTL definition of a LDVM component and import it into system. This makes LDVM
    // discovery possible.
    component match { case (name, url) =>
      withDownloadedFile(name, url) { file =>
        ldvmService.fromRdf(file) match {
          case (Some(componentId :: _), Some(_)) => // match non empty list
            InstallResult.success("Component '" + name + "' has been imported")
          case _ =>
            InstallResult.failure("Component import of '" + name + "' failed")
        }
      }
    }
  }

  private def installDataSource(dataSource: (String, String))(implicit session: Session) = {
    // Download a TTL file with the data set, import it into local Virtuoso instance and make it
    // a data source. Add a complementary user data source to make it accessible from the
    // application generator (we use the admin user with id 1 as the data source owner).
    dataSource match { case (name, url) =>
      dataSourceService.createDataSourceFromRemoteTtl(Seq(url), name) map { dataSourceTemplateId =>
        userDataSourcesService.add(dataSourceTemplateId, name, isPublic = true, UserId(1))
        InstallResult.success("Data source '" + name + "' has been imported")
      } getOrElse InstallResult.failure("Data source import of '" + name + "' failed")
    }
  }

  private def installVisualizer(visualizer: (String, String, String, String))(implicit session: Session) = {
    // Install an application generator Visualizer which means that we take an appropriate LDVM
    // visualizer component and add necessary meta data (name and icon) to link it with the
    // plugin implementation.
    visualizer match { case (title, uri, name, icon) =>
      val updateRequest = UpdateVisualizerRequest("", 0, name, icon, disabled = false)
      componentTemplateRepository.findByUri(uri) map { component =>
        visualizerService.addVisualizer(component) map { visualizer =>
          visualizerService.updateVisualizer(visualizer, updateRequest)
        } match {
          case Success(_) =>
            InstallResult.success("Visualizer '" + title + "' has been imported")
          case Failure(e) =>
            InstallResult.failure("Visualizer import of '" + title + "' failed. " + e.getMessage)
        }
      } getOrElse InstallResult.failure("Missing LDVM component for the visualizer '" + title + "'")
    }
  }

  private def withDownloadedFile(name: String, url: String)
    (func: File => InstallResult.InstallResult) = {
    val tempFile = File.createTempFile("install", ".ttl")

    val result = if (downloadFile(url, tempFile))
      func(tempFile)
    else
      InstallResult.failure("Unable to download the TTL file for '" + name + "'")

    tempFile.delete
    result
  }

  private def downloadFile(url: String, file: File) = {
    (new URL(url) #> new File(file.getAbsolutePath) !) == 0
  }
}
