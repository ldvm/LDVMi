import model.service._
import model.service.impl.{PipelineServiceImpl, CompatibilityServiceImpl, ComponentTemplateServiceImpl}
import model.service.ldvm.LdvmServiceImpl
import scaldi.Module

class ServiceModule extends Module {
  bind[ComponentTemplateService] to new ComponentTemplateServiceImpl
  bind[PipelineService] to new PipelineServiceImpl
  bind[CompatibilityService] to new CompatibilityServiceImpl
  bind[LdvmService] to new LdvmServiceImpl
}