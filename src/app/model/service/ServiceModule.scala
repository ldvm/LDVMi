import model.service._
import model.service.impl.pipeline.PipelineServiceImpl
import model.service.impl.{CompatibilityServiceImpl, ComponentServiceImpl}
import model.service.ldvm.LdvmServiceImpl
import scaldi.Module

class ServiceModule extends Module {
  bind[ComponentService] to new ComponentServiceImpl
  bind[PipelineService] to new PipelineServiceImpl
  bind[CompatibilityService] to new CompatibilityServiceImpl
  bind[LdvmService] to new LdvmServiceImpl
}