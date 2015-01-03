package controllers

import scaldi.Module

class ControllerModule extends Module {
  binding to new ApplicationController
  binding to new DataCubeController
  binding to new MapController
  binding to new PipelineController
  binding to new ComponentTemplateController
}