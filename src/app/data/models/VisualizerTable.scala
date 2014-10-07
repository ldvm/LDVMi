package data.models

import data.models.PortableJodaSupport._
import org.joda.time.DateTime
import play.api.db.slick.Config.driver.simple._

case class Visualizer(id: Long, name: String, inputSignature: String, var createdUtc: Option[DateTime] = None, var modifiedUtc: Option[DateTime] = None) extends IdentifiedEntity

class VisualizerTable(tag: Tag) extends Table[Visualizer](tag, "VISUALIZERS") with IdentifiedEntityTable[Visualizer] {
  val dataSources = TableQuery[DataSourcesTable]

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def inputSignature = column[String]("INPUT_SIGNATURE", O.NotNull)

  def createdUtc = column[Option[DateTime]]("CREATED")

  def modifiedUtc = column[Option[DateTime]]("MODIFIED")

  def dataSourceId = column[Long]("DATASOURCE_ID")

  def * = (id, name, inputSignature, createdUtc, modifiedUtc) <>(Visualizer.tupled, Visualizer.unapply _)

}



