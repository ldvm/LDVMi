package model.service.impl

import model.service.PartialPipeline

case class DiscoveryIterationInput(
  number: Int,
  partialPipelines: Seq[PartialPipeline],
  completePipelines: Seq[PartialPipeline]
  )
