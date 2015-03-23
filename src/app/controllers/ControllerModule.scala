package controllers

import controllers.react
import scaldi.Module

class ControllerModule extends Module {
  binding to new ApplicationController
  binding to new DataCubeController
  binding to new MapController
  binding to new PipelineController
  binding to new ComponentTemplateController
  binding to new VisualizationController

  binding to new react.ApplicationController
}