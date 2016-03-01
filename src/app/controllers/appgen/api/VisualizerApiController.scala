package controllers.appgen.api

import model.entity.PipelineEvaluation
import model.service.PipelineService
import play.api.libs.iteratee.{Enumerator, Enumeratee, Iteratee}
import play.api.libs.json.{Writes, JsValue}
import play.api.mvc._
import model.appgen.entity._
import model.appgen.repository.ApplicationsRepository
import scaldi.Injector
import model.appgen.rest.Response._
import play.api.libs.concurrent.Execution.Implicits._
import utils.PaginationInfo
import scala.concurrent.Future
import play.api.libs.json._
import play.api.Play.current
import play.api.cache.Cache

import scala.util.Success

abstract class VisualizerApiController(implicit inj: Injector) extends RestController {
  val applicationsRepository = inject[ApplicationsRepository]
  val pipelineService = inject[PipelineService]

  private def cacheKey(implicit request: RestRequest): String = {
    request.uri + "|user:" + request.user.id.get + "|body=" + Json.toJson(request.body)
  }

  /** Caches request result */
  protected def cached(func: () => Future[Result])
    (implicit request: RestRequest): Future[Result] = {
    Cache.getAs[Result](cacheKey) match {
      case Some(result: Result) => Future(result)
      case None => func() andThen {
        case Success(result) => {
          Cache.set(cacheKey, result)
          result
        }
      }
    }
  }

  protected def withApplication(id: ApplicationId)
    (func: Application => Future[Result])
    (implicit request: RestRequest): Future[Result] = {

    applicationsRepository.findById(request.user, id) match {
      case Some(application: Application) => func(application)
      case None => Future(BadRequest(ErrorResponse("The application does not exist or is not accessible")))
    }
  }

  protected def withEvaluation(id: ApplicationId)
    (func: PipelineEvaluation => Future[Result])
    (implicit request: RestRequest): Future[Result] = {

    withApplication(id) { application =>
      (for {
        pipeline <- pipelineService.findById(application.pipelineId)
        evaluations <- Some(pipelineService.lastEvaluations(pipeline.id.get, PaginationInfo(0, 1)))
        evaluation <- evaluations.headOption // For now simply select the latest evaluation
      } yield (pipeline, evaluations, evaluation)) match {
        case Some((pipeline, evaluations, evaluation)) => func(evaluation)
        case _ => Future(BadRequest(ErrorResponse("Failed to load evaluation for this application.")))
      }
    }
  }

  protected def enumeratorToSeq[E](enumerator: Enumerator[Option[E]]): Future[List[E]] = {
    enumerator.through(Enumeratee.filter(_.isDefined)).run(
      Iteratee.fold(List.empty[E])((list, item) => list :+ item.get)
    )
  }

  protected def enumeratorToResult[E]
    (propertyName: String, enumerator: Enumerator[Option[E]])
    (implicit jsonWrites: Writes[E]): Future[Result] = {

    enumeratorToSeq(enumerator).transform(r =>
      Ok(SuccessResponse(data = Seq(propertyName -> Json.toJson(r)))), t => t)
  }
}
