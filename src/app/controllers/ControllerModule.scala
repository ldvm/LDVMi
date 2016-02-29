package controllers

import controllers.appgen.api._
import controllers.util.AngularController
import scaldi.Module

class ControllerModule extends Module {
  binding to new ApplicationController
  binding to new DataCubeController
  binding to new MapController
  binding to new ComponentTemplateController
  binding to new VisualizationController
  binding to new AngularController

  binding to new appgen.ApplicationController
  binding to new AuthApiController
  binding to new CreateAppApiController
  binding to new ManageAppApiController
  binding to new CommonApiController
  binding to new MapsVisualizerApiController
}