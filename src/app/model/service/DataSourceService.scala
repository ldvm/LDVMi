package model.service

import java.io.File
import java.util.UUID

trait DataSourceService {

  def createDataSourceFromRemoteTtl(uris: Seq[String]) : Option[UUID]

  def createDataSourceFromFiles(files: Seq[(Option[String], File)]) : Option[UUID]

}
