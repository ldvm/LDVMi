package controllers

import controllers.util.AngularController
import scaldi.Module

class ControllerModule extends Module {
  binding to new ApplicationController
  binding to new DataCubeController
  binding to new MapController
  binding to new ComponentTemplateController
  binding to new VisualizationController
  binding to new AngularController
}