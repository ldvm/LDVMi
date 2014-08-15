package controllers

import data.models._
import play.api.Play.current
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick._
import play.api.mvc._
import scaldi.{Injectable, Injector}

import scala.slick.lifted.TableQuery

class Application(implicit inj: Injector) extends Controller with Injectable {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def populateDB = DBAction { implicit rs =>

    val visualizations = TableQuery[Visualizations]
    val dataSources = TableQuery[DataSources]

    TableQuery[VisualizationQueries].delete
    visualizations.delete
    dataSources.delete

    val did1 = (dataSources returning dataSources.map(_.id)) += DataSource(1, "Payola Live", "http://live.payola.cz:8890/sparql", Some("http://3373037d-48fa-4023-91ed-37112448f0c0"))
    val vid1 = (visualizations returning visualizations.map(_.id)) += Visualization(1, "Population QB", did1, did1)

    val did2 = (dataSources returning dataSources.map(_.id)) += DataSource(2, "Payola Live", "http://live.payola.cz:8890/sparql", Some("http://9db45e76-41e6-4aa3-a137-1536ffbd6aa2"))
    val vid2 = (visualizations returning visualizations.map(_.id)) += Visualization(2, "MFCR QB", did2, did2)

    Ok(vid1 + "::" + vid2)

  }

}