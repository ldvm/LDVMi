package controllers.api

import data.models._

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.db.slick._
import play.api.Play.current

import scaldi.{Injectable, Injector}
import services.data.rdf.sparql.datacube.DataCubeService


class DataCube(implicit inj: Injector) extends Controller with Injectable {

  val dataCubeService = inject [DataCubeService]

  def datasets(id: Long) = DBAction { implicit rs =>

    Visualizations.findByIdWithDataSource(id).map { case (visualization, datasource) =>

        Ok(dataCubeService.getDatasets(datasource).toString)

    }.getOrElse {
      NotFound
    }
  }

}