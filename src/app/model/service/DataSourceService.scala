package model.service

import model.entity.DataSourceTemplateId
import play.api.db.slick.Session
import play.api.libs.Files
import play.api.mvc.MultipartFormData

trait DataSourceService {

  def createDataSourceFromRemoteTtl(uris: Seq[String])(implicit session: Session): Option[DataSourceTemplateId]

  def createDataSourceFromFiles(files: Seq[MultipartFormData.FilePart[Files.TemporaryFile]])(implicit session: Session): Option[DataSourceTemplateId]

}
