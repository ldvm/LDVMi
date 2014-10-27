package controllers.api

import model.dao.VisualizationEagerBox
import model.services.VisualizationService
import model.services.rdf.sparql.datacube.DataCubeService
import model.services.rdf.sparql.geo.GeoService
import play.api.Play.current
import play.api.db.slick._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.iteratee.{Enumeratee, Enumerator, Iteratee}
import play.api.libs.json.{JsError, JsResult, JsSuccess, JsValue}
import play.api.mvc.{Action, Controller, Result, Results}
import scaldi.{Injectable, Injector}

import scala.concurrent.Future

abstract class ApiController(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject[DataCubeService]
  val visualizationService = inject[VisualizationService]
  val geoService = inject[GeoService]


  protected def simpleFuture[E]
    (id: Long)
      (enumeratorGetter: VisualizationEagerBox => Enumerator[Option[E]])
      (jsonFormatter: List[E] => JsValue) = Action.async { implicit request =>
    DB.withSession { s =>
      withVisualizationAndDataSourcesFuture(id) { visualizationEagerBox =>

        val enumerator = enumeratorGetter(visualizationEagerBox)
        futureToResult(enumeratorToSeq(enumerator), jsonFormatter)

      }(s)
    }
  }

  protected def parsingFuture[E, JsonType](id: Long)
      (futureGetter: (VisualizationEagerBox, JsonType, JsValue) => Future[Result])
      (jsonValidate: JsValue => JsResult[JsonType]) = Action.async(parse.json(1024 * 1024 * 100)) { implicit request =>
    val json: JsValue = request.body

    jsonValidate(json) match {

      case jsonSuccess: JsSuccess[JsonType] =>

        DB.withSession { s =>
          withVisualizationAndDataSourcesFuture(id) { visualizationEagerBox =>
            futureGetter(visualizationEagerBox, jsonSuccess.get, json)
          }(s)
        }

      case e: JsError => Future(UnprocessableEntity)
    }
  }

  protected def simpleParsingFuture[E, JsonType](id: Long)
      (enumeratorGetter: (VisualizationEagerBox, JsonType, JsValue) => Enumerator[Option[E]])
      (jsonValidate: JsValue => JsResult[JsonType])
      (jsonFormatter: List[E] => JsValue) = parsingFuture(id) { (visualizationEagerBox, entity: JsonType, json) =>

        val enumerator = enumeratorGetter(visualizationEagerBox, entity, json)
        futureToResult(enumeratorToSeq(enumerator), jsonFormatter)

  }(jsonValidate)


  protected def withVisualizationAndDataSourcesFuture(id: Long)
      (func: VisualizationEagerBox => Future[Result])
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Future[Result] = {

    visualizationService.getByIdWithEager(id).map { visualizationEagerBox =>
      func(visualizationEagerBox)
    }.getOrElse {
      Future { NotFound }
    }
  }

  protected def withVisualizationEagerBox(id: Long)
      (func: VisualizationEagerBox => Result)
      (implicit rs: play.api.db.slick.Config.driver.simple.Session): Result = {

    visualizationService.getByIdWithEager(id).map { visualizationEagerBox =>
      func(visualizationEagerBox)
    }.getOrElse {
      NotFound
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

}
