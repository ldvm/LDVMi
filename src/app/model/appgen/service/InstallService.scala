package model.appgen.service

import model.appgen.entity.InstallResult
import model.service.LdvmService
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}
import sys.process._
import java.net.URL
import java.io.File
import model.appgen.InstallBundle

class InstallService(implicit inj: Injector) extends Injectable {
  val ldvmService = inject[LdvmService]

  def install(implicit session: Session) = {
    InstallBundle.ldvmComponents map installLdvmComponent
  }

  private def installLdvmComponent(component: (String, String))(implicit session: Session) = {
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
