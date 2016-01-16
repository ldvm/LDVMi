package controllers.api

import model.entity._
import model.rdf.sparql.datacube.DataCubeService
import model.rdf.sparql.geo.GeoService
import model.rdf.sparql.visualization.VisualizationService
import model.service.{DataSourceService, ComponentTemplateService, PipelineService}
import play.api.Play.current
import play.api.Routes
import play.api.db.slick._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.iteratee.{Enumeratee, Enumerator, Iteratee}
import play.api.libs.json._
import play.api.mvc.{Action, Controller, Result, Results}
import scaldi.{Injectable, Injector}

import scala.concurrent.Future

abstract class ApiController(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject[DataCubeService]
  val pipelineService = inject[PipelineService]
  val componentTemplateService = inject[ComponentTemplateService]
  val dataSourceService = inject[DataSourceService]
  val visualizationService = inject[VisualizationService]
  val geoService = inject[GeoService]

  def javascriptRoutes = Action { implicit request =>
    Ok(
      Routes.javascriptRouter("jsRoutes")(
        controllers.api.routes.javascript.LdvmApiController.ttl,
        controllers.api.routes.javascript.MapApiController.polygonEntities,
        controllers.api.routes.javascript.MapApiController.polygonEntitiesProperties,
        controllers.api.routes.javascript.MapApiController.markers,
        controllers.api.routes.javascript.MapApiController.properties,
        controllers.api.routes.javascript.VisualizationApiController.getCachedResult,
        controllers.api.routes.javascript.VisualizationApiController.dataReferences,
        controllers.api.routes.javascript.VisualizationApiController.queries,
        controllers.api.routes.javascript.SkosApiController.schemes,
        controllers.api.routes.javascript.SkosApiController.concepts,
        controllers.api.routes.javascript.SkosApiController.conceptsTolerant,
        controllers.api.routes.javascript.SkosApiController.scheme,
        controllers.api.routes.javascript.SkosApiController.createVisualisation,
        controllers.api.routes.javascript.SkosApiController.conceptsCounts,
        controllers.api.routes.javascript.PipelineApiController.findById,
        controllers.api.routes.javascript.PipelineApiController.visualizationById,
        controllers.api.routes.javascript.PipelineApiController.evaluations,
        controllers.api.routes.javascript.PipelineApiController.list,
        controllers.api.routes.javascript.PipelineApiController.discover,
        controllers.api.routes.javascript.PipelineApiController.evaluate,
        controllers.api.routes.javascript.DataSourceApiController.fromFile,
        controllers.api.routes.javascript.DataCubeApiController.dataStructures,
        controllers.api.routes.javascript.DataCubeApiController.createVisualisation,
        controllers.api.routes.javascript.DataCubeApiController.dataStructureComponents,
        controllers.api.routes.javascript.DataCubeApiController.values,
        controllers.api.routes.javascript.DataCubeApiController.sliceCube,
        controllers.api.routes.javascript.DataCubeApiController.datasets,
        controllers.api.routes.javascript.DataCubeApiController.customCube,
        controllers.api.routes.javascript.ComponentTemplateApiController.delete,
        controllers.api.routes.javascript.ComponentTemplateApiController.list,
        controllers.api.routes.javascript.ComponentTemplateApiController.findById,
        controllers.api.routes.javascript.ComponentTemplateApiController.featuresById,
        controllers.api.routes.javascript.ComponentTemplateApiController.inputsById,
        controllers.api.routes.javascript.ComponentTemplateApiController.outputById,
        controllers.api.routes.javascript.ComponentTemplateApiController.descriptorsById,
        controllers.api.routes.javascript.ComponentTemplateApiController.addDatasource,
        controllers.api.routes.javascript.CompatibilityApiController.check
      )
    ).as("text/javascript")
  }

  protected def createVisualisation(dataSourceTemplateId: Long, visualizerUri: String) = DBAction { implicit rs =>
    withDataSourceTemplate(dataSourceTemplateId) { d =>
      val visualizer = componentTemplateService.findVisualizerByUri(visualizerUri)
      visualizer.map { v =>
        val evaluationId = pipelineService.evaluateSimplePipeline((d, v))
        Ok(JsObject(Seq(("id", JsNumber(evaluationId.get.id)))))
      }.getOrElse {
        NotFound
      }
    }
  }

  protected def simpleParsingFuture[E, JsonType](id: Long)
    (enumeratorGetter: (PipelineEvaluation, JsonType, JsValue) => Option[Enumerator[Option[E]]])
    (jsonValidate: JsValue => JsResult[JsonType])
    (jsonFormatter: List[E] => JsValue) = parsingFuture(id) { (pipelineEvaluation, entity: JsonType, json) =>

    enumeratorGetter(pipelineEvaluation, entity, json).map { enumerator =>
      futureToResult(enumeratorToSeq(enumerator), jsonFormatter)
    }.getOrElse{
      Future(NotFound)
    }

  }(jsonValidate)

  protected def parsingFuture[E, JsonType](id: Long)
    (futureGetter: (PipelineEvaluation, JsonType, JsValue) => Future[Result])
    (jsonValidate: JsValue => JsResult[JsonType]) = Action.async(parse.json(1024 * 1024 * 100)) { implicit request =>
    val json: JsValue = request.body

    jsonValidate(json) match {

      case jsonSuccess: JsSuccess[JsonType] =>

        DB.withSession { s =>
          withVisualizationAndDataSourcesFuture(id) { pipelineEvaluation =>
            futureGetter(pipelineEvaluation, jsonSuccess.get, json)
          }(s)
        }

      case e: JsError => Future(UnprocessableEntity)
    }
  }

  protected def simpleFuture[E]
  (id: Long)
    (enumeratorGetter: PipelineEvaluation => Option[Enumerator[Option[E]]])
    (jsonFormatter: List[E] => JsValue) = Action.async { implicit request =>
    DB.withSession { s =>
      withVisualizationAndDataSourcesFuture(id) { visualizationEagerBox =>

        enumeratorGetter(visualizationEagerBox).map { enumerator =>
          futureToResult(enumeratorToSeq(enumerator), jsonFormatter)
        }.getOrElse {
          Future(NotFound)
        }

      }(s)
    }
  }

  protected def withVisualizationAndDataSourcesFuture(id: Long)
    (func: PipelineEvaluation => Future[Result])
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): Future[Result] = {

    pipelineService.findEvaluationById(PipelineEvaluationId(id)).map { visualizationEagerBox =>
      func(visualizationEagerBox)
    }.getOrElse {
      Future {NotFound}
    }
  }

  protected def enumeratorToSeq[E](enumerator: Enumerator[Option[E]]): Future[List[E]] = {
    enumerator.through(Enumeratee.filter(_.isDefined)).run(
      Iteratee.fold(List.empty[E])((list, item) => list :+ item.get)
    )
  }

  protected def futureToResult[E](future: Future[List[E]], jsonFormatter: List[E] => JsValue): Future[Result] = {
    future.transform(r => Results.Ok(jsonFormatter(r)), t => t)
  }

  protected def withEvaluation(id: Long)(func: PipelineEvaluation => Result)(implicit session: Session): Result = {
    pipelineService.findEvaluationById(PipelineEvaluationId(id)).map(func).getOrElse(NotFound)
  }

  protected def withDataSourceTemplate(id: Long)(func: DataSourceTemplate => Result)(implicit session: Session): Result = {
    dataSourceService.findById(DataSourceTemplateId(id)).map(func).getOrElse(NotFound)
  }

}
