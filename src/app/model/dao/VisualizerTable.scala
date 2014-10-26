package model.dao

import org.joda.time.DateTime
import play.api.db.slick.Config.driver.simple._
import PortableJodaSupport._

case class Visualizer(
  id: Long,
  name: String,
  inputSignature: String,
  url: String,
  description: Option[String],
  dsdInputSignature: Option[String],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends IdentifiedEntity

class VisualizerTable(tag: Tag) extends Table[Visualizer](tag, "VISUALIZERS") with IdentifiedEntityTable[Visualizer] {

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME", O.NotNull)

  def inputSignature = column[String]("INPUT_SIGNATURE", O.NotNull)

  def dsdInputSignature = column[Option[String]]("DSD_INPUT_SIGNATURE")

  def url = column[String]("URL", O.NotNull)

  def description = column[Option[String]]("DESCRIPTION")

  def createdUtc = column[Option[DateTime]]("CREATED")

  def modifiedUtc = column[Option[DateTime]]("MODIFIED")

  def dataSourceId = column[Long]("DATASOURCE_ID")

  def * = (id, name, inputSignature, url, description, dsdInputSignature, createdUtc, modifiedUtc) <>(Visualizer.tupled, Visualizer.unapply _)

}



