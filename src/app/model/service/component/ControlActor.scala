package model.service.component

import akka.actor.{Actor, ActorRef, Props}
import model.entity.{PipelineEvaluationResult, PipelineEvaluation}
import model.repository.{ComponentTemplateRepository, PipelineEvaluationResultRepository, PipelineEvaluationRepository}
import play.api.libs.concurrent.Akka

import play.api.Play.current
import scaldi.{Injector, Injectable}
import scala.collection.mutable.ArrayBuffer
import scala.concurrent.ExecutionContext.Implicits.global
import model.service.Connected

case class ResultRequest()
case class Result(dataReferences: Seq[DataReference])

class ControlActor(evaluation: PipelineEvaluation, reporterProps: Props, visualizerUri: String)(implicit val inj: Injector) extends Actor with Connected with Injectable{

  val evaluationRepo = inject[PipelineEvaluationRepository]
  val componentsRepo = inject[ComponentTemplateRepository]
  val evaluationResultRepo = inject[PipelineEvaluationResultRepository]

  def receive = {
    case r: Result => {
      withSession { implicit session =>
        evaluationRepo.save(
          evaluation.copy(isFinished = true, isSuccess = Some(true))
        )

        val visualizer = componentsRepo.findByUri(visualizerUri).get
        val inputs = visualizer.inputTemplates.map(_.dataPortTemplate).map { i => (i.uri, i.id.get) }.toMap

        r.dataReferences.map { dr =>
          val portTemplateId = inputs.get(dr.portUri).get
          evaluationResultRepo.save(
            PipelineEvaluationResult(None, evaluation.id.get, visualizer.id.get, portTemplateId, dr.endpointUri, dr.graphUri)
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
