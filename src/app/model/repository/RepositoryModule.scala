import model.repository._
import scaldi.Module

class RepositoryModule extends Module {

  binding to new ComponentTemplateRepository
  binding to new AnalyzerTemplateRepository
  binding to new DataSourceTemplateRepository
  binding to new TransformerTemplateRepository
  binding to new VisualizerTemplateRepository

  binding to new DataPortTemplateRepository
  binding to new InputTemplateRepository
  binding to new OutputTemplateRepository

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
  binding to new NestedDataPortBindingRepository
  binding to new DataPortBindingSetRepository

  binding to new ComponentInstanceMembershipRepository

  binding to new PipelineRepository
  binding to new PipelineDiscoveryRepository
  binding to new PipelineEvaluationRepository
}