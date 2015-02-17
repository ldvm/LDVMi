package model.service.impl.pipeline

import akka.actor.Props
import model.entity.{DataPortBindingSet, DataPortTemplateId, PipelineEvaluation}
import model.service.Connected
import model.service.component.{DataReference, InternalComponent, Run}
import play.api.db.slick._
import play.api.libs.concurrent.Akka
import scaldi.Injectable

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import play.api.Play.current

class PipelineEvaluationAlgorithm(evaluation: PipelineEvaluation)(reporterProps: Option[Props] = None)
  (implicit val session: Session) extends Connected with Injectable {

  val maybeLogger = reporterProps.map(Akka.system.actorOf)
  maybeLogger.map { logger => logger ! evaluation.uuid.toString }

  def run(bindingSet: DataPortBindingSet, maybeExternalDependencies: Option[Map[DataPortTemplateId, DataReference]] = None): Future[(String, Option[String])] = {
    val componentInstances = bindingSet.componentInstances
    println("II", componentInstances.map(_.id))
    val bindings = bindingSet.bindings
    val nestedBindings = bindingSet.nestedBindings

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

    if (nestedBindings.nonEmpty) {
      maybeExternalDependencies.map { externalDependencies =>
        nestedBindings.map { nestedBinding =>
          nestedBinding.sourcePortTemplateId.map { sourcePortTemplateId =>
            externalDependencies.get(sourcePortTemplateId).map { ref =>
              println("XX:", nestedBinding, instancesById.get(nestedBinding.targetInstance.get.componentInstanceId), nestedBinding.targetInstance.get.componentInstanceId)
              instancesById.get(nestedBinding.targetInstance.get.componentInstanceId).map { case (targetInstance, _, _) =>
                targetInstance.actor ! DataReference(nestedBinding.targetInstance.get.uri, ref.endpointUri, ref.graphUri)
              }
            }
          }
        }
      }
    } else {
      instancesById.map { case (_, (c, _, hasInput)) =>
        if (!hasInput) {
          c.actor ! Run()
        }
      }

      instancesById.map { case (_, (c, hasOutput, _)) =>
        if (!hasOutput) {
          //c.actor ?
        }
      }
    }

    Future(("x", Some("y")))

  }

}