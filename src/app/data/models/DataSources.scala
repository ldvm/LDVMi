package data.models

import play.api.db.slick.Config.driver.simple._

case class DataSource(id: Long, name: String, endpointUrl: String, namedGraphs: Option[String] = None)


class DataSources(tag: Tag) extends Table[DataSource](tag, "DATASOURCES") {
  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def endpointUrl = column[String]("ENDPOINT_URL", O.NotNull)

  def namedGraphs = column[Option[String]]("NAMED_GRAPHS")

  def * = (id, name, endpointUrl, namedGraphs) <> (DataSource.tupled, DataSource.unapply _)
}