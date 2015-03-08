package model.service.component

import akka.actor.{Actor, ActorRef, Props}
import model.entity.{ComponentInstance, PipelineEvaluationResult, PipelineEvaluation}
import model.repository.{ComponentTemplateRepository, PipelineEvaluationResultRepository, PipelineEvaluationRepository}
import play.api.libs.concurrent.Akka

import play.api.Play.current
import scaldi.{Injector, Injectable}
import scala.collection.mutable.ArrayBuffer
import scala.concurrent.ExecutionContext.Implicits.global
import model.service.SessionScoped

case class ResultRequest()
case class Result(dataReferences: Seq[DataReference])

class ControlActor(evaluation: PipelineEvaluation, reporterProps: Props, visualizerInstance: ComponentInstance)(implicit val inj: Injector) extends Actor with SessionScoped with Injectable{

  val evaluationRepo = inject[PipelineEvaluationRepository]
  val componentsRepo = inject[ComponentTemplateRepository]
  val evaluationResultRepo = inject[PipelineEvaluationResultRepository]

  def receive = {
    case r: Result => {
      withSession { implicit session =>
        evaluationRepo.save(
          evaluation.copy(isFinished = true, isSuccess = Some(true))
        )

        val inputs = visualizerInstance.inputInstances.map(_.dataPortInstance).map { i => (i.uri, i.dataPortTemplate.id.get) }.toMap

        r.dataReferences.map { dr =>
          val portTemplateId = inputs.get(dr.portUri).get
          evaluationResultRepo.save(
            PipelineEvaluationResult(None, evaluation.id.get, visualizerInstance.componentTemplate.id.get, portTemplateId, dr.endpointUri, dr.graphUri)
          )
        }
      }
    }
    case f: Failure => {
      withSession { implicit session =>
        evaluationRepo.save(
          evaluation.copy(isFinished = true, isSuccess = Some(false))
        )
      }
    }
  }

}
