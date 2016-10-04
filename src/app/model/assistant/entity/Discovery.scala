package model.assistant.entity

import model.entity.{PipelineDiscovery, PipelineDiscoveryId}
import org.joda.time.DateTime

/** Merged information from UserPipelineDiscovery and PipelineDiscovery */
case class Discovery(
  id: Option[UserPipelineDiscoveryId],
  name: String,
  userId: UserId,
  pipelineDiscoveryId: PipelineDiscoveryId,
  isFinished: Boolean,
  isSuccess: Option[Boolean],
  pipelinesDiscoveredCount: Option[Int],
  createdUtc: Option[DateTime],
  modifiedUtc: Option[DateTime])

object Discovery {
  def merge(d: (UserPipelineDiscovery, PipelineDiscovery)) = { d match {
      case (uPD, dP) =>
        new Discovery(
          uPD.id,
          uPD.name,
          uPD.userId,
          uPD.pipelineDiscoveryId,
          dP.isFinished,
          dP.isSuccess,
          dP.pipelinesDiscoveredCount,
          dP.createdUtc,
          dP.modifiedUtc)
    }
  }
}
