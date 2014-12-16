import model.repository._
import scaldi.Module

class RepositoryModule extends Module {

  binding to new ComponentRepository
  binding to new AnalyzerRepository
  binding to new DataSourceRepository
  binding to new TransformerRepository
  binding to new VisualizerRepository

  binding to new DataPortRepository
  binding to new InputRepository
  binding to new OutputRepository

  binding to new FeatureRepository
  binding to new FeatureToComponentRepository
  binding to new DescriptorRepository

  binding to new ComponentInstanceRepository
  binding to new AnalyzerInstanceRepository
  binding to new VisualizerInstanceRepository
  binding to new DataSourceInstanceRepository
  binding to new TransformerInstanceRepository

  binding to new DataPortInstanceRepository
  binding to new InputInstanceRepository
  binding to new OutputInstanceRepository

  binding to new DataPortBindingRepository
  binding to new DataPortBindingSetRepository

  binding to new ComponentInstanceMembershipRepository

  binding to new PipelineRepository
}