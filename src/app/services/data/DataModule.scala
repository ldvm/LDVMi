package services.data

import scaldi.Module

class DataModule extends Module {
  bind[VisualizationService] to new VisualizationServiceImpl
}
