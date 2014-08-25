package data.models

import play.api.db.slick.Config.driver.simple._

case class DataSourceRow(id: Long, name: String, endpointUrl: String, namedGraphs: Option[String] = None)


class DataSourcesTable(tag: Tag) extends Table[DataSourceRow](tag, "DATASOURCES") {
  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def endpointUrl = column[String]("ENDPOINT_URL", O.NotNull)

  def namedGraphs = column[Option[String]]("NAMED_GRAPHS")

  def * = (id, name, endpointUrl, namedGraphs) <> (DataSourceRow.tupled, DataSourceRow.unapply _)
}