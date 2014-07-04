/*package data.models

import org.virtuslab.unicorn.UnicornPlay._
import org.virtuslab.unicorn.UnicornPlay.driver.simple._

case class VisualizationId(id: Long) extends AnyVal with BaseId

object VisualizationId extends IdCompanion[VisualizationId]

case class Visualization(
  id: Option[VisualizationId],
  endpointUrl: String,
  namedGraphs: String
) extends WithId[VisualizationId]

class Visualizations(tag: Tag) extends IdTable[VisualizationId, Visualization](tag, "VISUALIZATIONS") {
  def endpointUrl = column[String]("ENDPOINT_URL", O.NotNull)
  def namedGraphs = column[String]("NAMED_GRAPHS")

  override def * = (id.?, endpointUrl, namedGraphs) <> (Visualization.tupled, Visualization.unapply)
}*/