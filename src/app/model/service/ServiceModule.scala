import model.service._
import model.service.impl.pipeline.PipelineServiceImpl
import model.service.impl.{CompatibilityServiceImpl, ComponentTemplateServiceImpl}
import model.service.ldvm.LdvmServiceImpl
import play.api.Play
import scaldi.Module

class ServiceModule extends Module {
  bind[ComponentTemplateService] to new ComponentTemplateServiceImpl
  bind[PipelineService] to new PipelineServiceImpl
  bind[CompatibilityService] to new CompatibilityServiceImpl
  bind[LdvmService] to new LdvmServiceImpl
  binding to new GraphStore(Play.current.configuration.getString("ldvmi.triplestore.push").getOrElse(""))
}