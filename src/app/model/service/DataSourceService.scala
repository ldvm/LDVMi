package model.service

import java.util.UUID

import model.entity.{DataSourceTemplateTable, DataSourceTemplate, DataSourceTemplateId}
import model.repository.DataSourceTemplateRepository
import play.api.db.slick.Session
import play.api.libs.Files
import play.api.mvc.MultipartFormData

trait DataSourceService extends CrudService[DataSourceTemplateId, DataSourceTemplate, DataSourceTemplateTable, DataSourceTemplateRepository]{

  def createDataSourceFromRemoteTtl(uris: Seq[String], dataSourceName: String = "Downloaded RDF")(implicit session: Session): Option[DataSourceTemplateId]

  def createDataSourceFromFiles(files: Seq[MultipartFormData.FilePart[Files.TemporaryFile]], maybeUrn: Option[UUID] = None)(implicit session: Session): Option[DataSourceTemplateId]

  def createDataSourceFromUris(endpointUrl: String, graphUris: Option[Seq[String]], maybeDataSourceName: Option[String] = None)(implicit session: Session): Option[DataSourceTemplateId]

  def createDataSourceFromStrings(fileContents: Seq[(String, String)], maybeUrn: Option[UUID] = None)(implicit session: Session): Option[DataSourceTemplateId]

}
