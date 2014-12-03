import model.component._
import scaldi.Module

class ComponentModule extends Module {

  bind[ComponentComponent] to new ComponentComponentImpl
  bind[FeatureComponent] to new FeatureComponentImpl
  bind[InputComponent] to new InputComponentImpl
  bind[DataPortComponent] to new DataPortComponentImpl
  bind[SignatureComponent] to new SignatureComponentImpl
  bind[OutputComponent] to new OutputComponentImpl
  bind[FeatureToComponentComponent] to new FeatureToComponentComponentImpl
  bind[AnalyzerComponent] to new AnalyzerComponentImpl
  bind[TransformerComponent] to new TransformerComponentImpl
  bind[VisualizerComponent] to new VisualizerComponentImpl
  bind[DataSourceComponent] to new DataSourceComponentImpl
}