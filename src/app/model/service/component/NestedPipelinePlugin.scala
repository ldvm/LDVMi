package model.service.component

import model.entity.PipelineEvaluation
import model.service.impl.pipeline.PipelineEvaluationAlgorithm
import model.service.Connected
import scala.concurrent.Future

class NestedPipelinePlugin(internalComponent: InternalComponent) extends AnalyzerPlugin with Connected {
  override def run(inputs: Seq[DataReference]): Future[(String, Option[String])] = {

    withSession { implicit session =>
      val template = internalComponent.componentInstance.componentTemplate
      val maybeBindingSet = template.nestedBindingSet

      maybeBindingSet.map { nestedBindingSet =>

        val evaluation = new PipelineEvaluation(None, false, None)
        
        
        val mapping = inputs.map{dr =>
          val portTemplateId = internalComponent.componentInstance.inputInstances.find(_.dataPortInstance.uri == dr.portUri).get.dataPortInstance.dataPortTemplateId
          (portTemplateId, dr)
        }.toMap
        new PipelineEvaluationAlgorithm(evaluation)().run(nestedBindingSet, Some(mapping))

      }.get
    }
  }
}
