package controllers.api

import scaldi.Module

class ApiModule extends Module {
  binding to new DataCubeApiController
  binding to new MapApiController
  binding to new VisualizerApiController
  binding to new PipelineApiController
  binding to new CompatibilityApiController
  binding to new PipelineApiController
  binding to new LdvmApiController
}
