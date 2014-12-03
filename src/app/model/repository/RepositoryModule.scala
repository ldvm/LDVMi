import model.repository._
import scaldi.Module

class RepositoryModule extends Module {

  binding to new ComponentRepository
  binding to new DataPortRepository
  binding to new FeatureRepository
  binding to new InputRepository
  binding to new OutputRepository
  binding to new RepositoryModule
  binding to new SignatureRepository
  binding to new FeatureToComponentRepository
  binding to new AnalyzerRepository
  binding to new DataSourceRepository
  binding to new TransformerRepository
  binding to new VisualizerRepository
}