import model.component._
import scaldi.Module

class ComponentModule extends Module {

  bind[ComponentComponent] to new ComponentComponentImpl
  bind[FeatureComponent] to new FeatureComponentImpl
  bind[InputComponent] to new InputComponentImpl
  bind[DataPortComponent] to new DataPortComponentImpl
  bind[SignatureComponent] to new SignatureComponentImpl
  bind[OutputComponent] to new OutputComponentImpl
}