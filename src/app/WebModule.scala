import controllers._
import scaldi.Module

class WebModule extends Module {
  binding to new ApplicationController
  binding to new DataCubeController
  binding to new MapController
  binding to new PipelineController
  binding to new ComponentController
  binding to new api.DataCubeApiController
  binding to new api.MapApiController
  binding to new api.VisualizationApiController
  binding to new api.VisualizerApiController
  binding to new api.ComponentApiController
}