package controllers.api

import data.models.VisualizationEagerBox
import play.api.mvc.{Result, Controller}
import scaldi.{Injector, Injectable}
import services.data.VisualizationService
import services.data.rdf.sparql.datacube.DataCubeService
import play.api.libs.concurrent.Execution.Implicits._
import services.data.rdf.sparql.geo.GeoService
import scala.concurrent.Future

abstract class ApiController(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject[DataCubeService]
  val visualizationService = inject[VisualizationService]
  val geoService = inject[GeoService]

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

}
