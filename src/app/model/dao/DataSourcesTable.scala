package model.dao

import model.dao.PortableJodaSupport._
import org.joda.time.DateTime
import play.api.db.slick.Config.driver.simple._


case class DataSource(id: Long, name: String, endpointUrl: String, namedGraphs: Option[String] = None, var createdUtc: Option[DateTime] = None, var modifiedUtc: Option[DateTime] = None) extends IdentifiedEntity


class DataSourcesTable(tag: Tag) extends Table[DataSource](tag, "DATASOURCES") with IdentifiedEntityTable[DataSource]  {
  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def endpointUrl = column[String]("ENDPOINT_URL", O.NotNull)

  def namedGraphs = column[Option[String]]("NAMED_GRAPHS")

  def createdUtc = column[Option[DateTime]]("created")

  def modifiedUtc = column[Option[DateTime]]("modified")

  def * = (id, name, endpointUrl, namedGraphs, createdUtc, modifiedUtc) <> (DataSource.tupled, DataSource.unapply _)
}