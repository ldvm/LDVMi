package services.data

import scaldi.Module

class DataModule extends Module {
  bind[VisualizationService] to new VisualizationServiceImpl
  bind[DataSourceService] to new DataSourceServiceImpl
  bind[VisualizationQueriesService] to new VisualizationQueriesServiceImpl
}
