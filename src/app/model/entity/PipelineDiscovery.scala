package model.entity

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._


case class PipelineDiscoveryId(id: Long) extends AnyVal with BaseId
object PipelineDiscoveryId extends IdCompanion[PipelineDiscoveryId]

case class PipelineDiscovery(
  id: Option[PipelineDiscoveryId],
  isFinished: Boolean,
  isSuccess: Option[Boolean],
  lastPerformedIteration: Option[Int],
  pipelinesDiscoveredCount: Option[Int],
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
  ) extends IdEntity[PipelineDiscoveryId]


class PipelineDiscoveryTable(tag: Tag) extends IdEntityTable[PipelineDiscoveryId, PipelineDiscovery](tag, "pipeline_discovery") {

  def isFinished = column[Boolean]("is_finished", O.NotNull)

  def isSuccess = column[Option[Boolean]]("is_success")

  def lastPerformedIteration = column[Option[Int]]("last_performed_iteration")

  def pipelinesDiscoveredCount = column[Option[Int]]("pipelines_discovered_count")

  def * = (id.?, isFinished, isSuccess, lastPerformedIteration, pipelinesDiscoveredCount, createdUtc, modifiedUtc) <> (PipelineDiscovery.tupled, PipelineDiscovery.unapply _)
}