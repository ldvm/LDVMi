package model.services

import scaldi.Module

class DataModule extends Module {
  bind[VisualizationService] to new VisualizationServiceImpl
  bind[VisualizerService] to new VisualizerServiceImpl
  bind[DataSourceService] to new DataSourceServiceImpl
  bind[CompatibilityService] to new CompatibilityServiceImpl
  bind[VisualizationQueriesService] to new VisualizationQueriesServiceImpl
  bind[LDVMService] to new LDVMServiceImpl
}
