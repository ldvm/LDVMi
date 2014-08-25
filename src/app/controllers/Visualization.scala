package controllers

import play.api._
import play.api.Play.current
import play.api.db.slick.DBAction
import play.api.mvc._
import scaldi.{Injectable, Injector}

class Visualization(implicit inj: Injector) extends Controller with Injectable {

  def list = DBAction {
    Ok(views.html.visualization.list())
  }

}