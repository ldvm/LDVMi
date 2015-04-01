package model.service.impl

import java.io.File
import java.util.UUID

import model.service.{GraphStore, DataSourceService}
import scaldi.{Injector, Injectable}

import scala.io.Source

class DataSourceServiceImpl(implicit inj: Injector) extends DataSourceService with Injectable {

  val graphStore = inject[GraphStore]

  def createDataSourceFromRemoteTtl(urls: Seq[String]): Option[UUID] = {
    if (urls.nonEmpty) {
      val urnUuid = UUID.randomUUID()
      val graphUri: String = "urn:" + urnUuid.toString
      urls.map { uri  =>
        val source = Source.fromURL(uri)
        val ttl = source.mkString
        source.close()
        graphStore.pushToTripleStore(ttl, graphUri)
      }
      Some(urnUuid)
    } else {
      None
    }
  }

  def createDataSourceFromFiles(files: Seq[(Option[String], File)]): Option[UUID] = {
    if (files.nonEmpty) {
      val urnUuid = UUID.randomUUID()
      val graphUri: String = "urn:" + urnUuid.toString
      files.map { case (maybeContentType, file) =>
        graphStore.pushToTripleStore(file, graphUri, maybeContentType)
      }
      Some(urnUuid)
    } else {
      None
    }
  }

}
