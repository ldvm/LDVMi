import model.service._
import model.service.impl.pipeline.PipelineServiceImpl
import model.service.impl.{ComponentInstanceServiceImpl, CompatibilityServiceImpl, ComponentTemplateServiceImpl}
import model.service.ldvm.LdvmServiceImpl
import scaldi.Module

class ServiceModule extends Module {
  bind[ComponentTemplateService] to new ComponentTemplateServiceImpl
  bind[PipelineService] to new PipelineServiceImpl
  bind[CompatibilityService] to new CompatibilityServiceImpl
  bind[ComponentInstanceService] to new ComponentInstanceServiceImpl
  bind[LdvmService] to new LdvmServiceImpl
}