package controllers.api

import data.models._

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.db.slick._
import play.api.Play.current

import scaldi.{Injectable, Injector}


class DataCube extends Controller {

  def datasets(id: Long) = DBAction { implicit rs =>

    Visualizations.findByIdWithDataSource(id).map { tuple =>
      Ok(views.html.dataCube(""))
    }.getOrElse {
      NotFound
    }
  }

}