package model.component

import model.entity._
import model.repository.{PipelineRepository, VisualizerRepository}

trait PipelineService extends CrudService[PipelineId, Pipeline, PipelineTable, PipelineRepository]
