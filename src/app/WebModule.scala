import controllers._
import scaldi.Module

class WebModule extends Module {
  binding to new Application
  binding to new DataCube
  binding to new api.DataCubeApi
  binding to new api.VisualizationApi
  binding to new Visualization
}