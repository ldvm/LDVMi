package controllers

import controllers.assistant.api._
import controllers.assistant.api.visualizers.{ChordVisualizerApiController, CommonVisualizerApiController, MapsVisualizerApiController, TimeLineVisualizerApiController}
import controllers.util.AngularController
import scaldi.Module

class ControllerModule extends Module {
  binding to new ApplicationController
  binding to new DataCubeController
  binding to new MapController
  binding to new ComponentTemplateController
  binding to new VisualizationController
  binding to new AngularController

  binding to new assistant.PlatformController
  binding to new assistant.ApplicationController
  binding to new AuthApiController
  binding to new CreateAppApiController
  binding to new AppApiController
  binding to new ManageAppApiController
  binding to new CommonApiController
  binding to new MapsVisualizerApiController
  binding to new ChordVisualizerApiController
  binding to new TimeLineVisualizerApiController
  binding to new CommonVisualizerApiController
  binding to new DashboardApiController
  binding to new CatalogApiController
  binding to new InstallApiController
}
