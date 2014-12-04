import model.component._
import scaldi.Module

class ComponentModule extends Module {
  bind[ComponentService] to new ComponentServiceImpl
  bind[FeatureService] to new FeatureServiceImpl
  bind[InputService] to new InputServiceImpl
  bind[DataPortService] to new DataPortServiceImpl
  bind[SignatureService] to new SignatureServiceImpl
  bind[OutputService] to new OutputServiceImpl
  bind[FeatureToComponentService] to new FeatureToComponentServiceImpl
  bind[AnalyzerService] to new AnalyzerServiceImpl
  bind[TransformerService] to new TransformerServiceImpl
  bind[VisualizerService] to new VisualizerServiceImpl
  bind[DataSourceService] to new DataSourceServiceImpl
  bind[PipelineService] to new PipelineServiceImpl
}