import controllers._
import scaldi.Module

class WebModule extends Module {
  binding to new ApplicationController
  binding to new DataCubeController
  binding to new MapController
  binding to new VisualizationController
  binding to new VisualizerController
  binding to new api.DataCubeApiController
  binding to new api.MapApiController
  binding to new api.VisualizationApiController
  binding to new api.VisualizerApiController()
}