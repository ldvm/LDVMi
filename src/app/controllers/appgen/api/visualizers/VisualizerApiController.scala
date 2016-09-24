package controllers.appgen.api.visualizers

import java.security.MessageDigest

import controllers.appgen.api.rest.RestController
import model.appgen.entity._
import model.appgen.rest.Response._
import model.appgen.rest.RestRequest
import model.appgen.service.{ApplicationsService, ResultCacheService}
import model.entity.PipelineEvaluation
import model.service.PipelineService
import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.iteratee.{Enumeratee, Enumerator, Iteratee}
import play.api.libs.json.{Writes, _}
import play.api.mvc._
import scaldi.Injector
import utils.PaginationInfo
import play.api.db.slick._

import scala.concurrent.Future
import scala.util.Success

abstract class VisualizerApiController(implicit inj: Injector) extends RestController {
  val applicationService = inject[ApplicationsService]
  val pipelineService = inject[PipelineService]
  val resultCacheService = inject[ResultCacheService]

  /** Caches request result */
  protected def cached(func: => Future[Result])
    (implicit request: RestRequest): Future[Result] = {
    resultCacheService.get(request) match {
      case Some(result) => Future(result)
      case None => func andThen {
        case Success(result) => {
          cacheResult(request, result)
          result
        }
      }
    }
  }

  protected def cacheResult(request: RestRequest, result: Result) = {
    // We get the result as a Future which is the probable reason why at this moment the db
    // session is already closed. So we need to create a new one.
    DB.withSession { implicit s =>
      resultCacheService.set(request, result)
    }
  }

  protected def withApplication(id: ApplicationId)
    (func: Application => Future[Result])
    (implicit request: RestRequest): Future[Result] = {

    applicationService.getApplicationIfAccessible(id, request.user) match {
      case Some(application) => func(application)
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
