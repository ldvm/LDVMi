package model.services

import scaldi.Module

class DataModule extends Module {
  bind[VisualizationService] to new VisualizationServiceImpl
  bind[VisualizerService] to new VisualizerServiceImpl
  bind[DataSourceService] to new DataSourceServiceImpl
  bind[VisualizationQueriesService] to new VisualizationQueriesServiceImpl
}
