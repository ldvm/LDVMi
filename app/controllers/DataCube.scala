package controllers

import play.api._
import play.api.Play.current
import play.api.mvc._
import scaldi.{Injectable, Injector}
/*
import repositories.VisualizationsRepository
import play.api.db.slick.DB
import data.models.{Visualizations, VisualizationId}
import org.virtuslab.unicorn.UnicornPlay.driver.simple._
import play.api.db.slick._
import org.virtuslab.unicorn.UnicornPlay._
*/

class DataCube(implicit inj: Injector) extends Controller with Injectable {
/*
  val tableQuery = TableQuery[Visualizations] { tag: Tag =>
    new Visualizations(tag)
  }

  val repository = new VisualizationsRepository(tableQuery)
*/
  def internal(id: Long) = Action {
/*
    DB.withSession { implicit session =>
      repository.findById(id).map{ v =>
        println(v)
      }
    }*/

    Ok(views.html.dataCube("Your new application is ready."))
  }

}