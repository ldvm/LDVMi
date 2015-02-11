package model.service.impl.pipeline

import akka.actor.Props
import model.entity.{Pipeline, PipelineEvaluation}
import model.service.Connected
import model.service.component.{Run, InternalComponent}
import play.api.db.slick._
import scaldi.{Injectable, Injector}

class PipelineEvaluationAlgorithm(pipeline: Pipeline, evaluation: PipelineEvaluation)(reporterProps: Props)
  (implicit val inj: Injector, implicit val session: Session) extends Connected with Injectable {

  def run() {
    val componentInstances = pipeline.componentInstances
    val bindingSet = pipeline.bindingSet
    val bindings = bindingSet.bindings

    val instancesById = componentInstances.map { componentInstance =>
      (componentInstance.id.get, (InternalComponent(componentInstance), componentInstance.hasOutput, componentInstance.hasInput))
    }.toMap

    bindings.map { binding =>
      val sourceInstanceId = binding.source.componentInstanceId
      val targetInstanceId = binding.target.componentInstanceId

      instancesById.get(targetInstanceId).map { case (targetInstance, targetHasOutput, _) =>
        instancesById.get(sourceInstanceId).map { case (sourceInstance, sourceHasOutput, _) =>
          targetInstance.requestDataFrom(sourceInstance, binding.targetId)
        }
      }
    }

    instancesById.map { case (_, (c, _, hasInput)) =>
      if (hasInput) {
        c.actor ! Run()
      }
    }
    // send data reference to data sources?

  }

}