import model.service._
import model.service.impl.{PipelineServiceImpl, CompatibilityServiceImpl, ComponentServiceImpl}
import scaldi.Module

class ServiceModule extends Module {
  bind[ComponentService] to new ComponentServiceImpl
  bind[PipelineService] to new PipelineServiceImpl
  bind[CompatibilityService] to new CompatibilityServiceImpl
}