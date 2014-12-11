import model.component._
import scaldi.Module

class ComponentModule extends Module {
  bind[ComponentService] to new ComponentServiceImpl
  bind[PipelineService] to new PipelineServiceImpl
}