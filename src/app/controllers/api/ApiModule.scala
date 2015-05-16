package controllers.api

import scaldi.Module

class ApiModule extends Module {
  binding to new DataCubeApiController
  binding to new MapApiController
  binding to new SkosApiController
  binding to new VisualizationApiController
  binding to new ComponentTemplateApiController
  binding to new PipelineApiController
  binding to new CompatibilityApiController
  binding to new PipelineApiController
  binding to new LdvmApiController
}
