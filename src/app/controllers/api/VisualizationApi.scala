package controllers.api

import data.models._
import play.api.Play.current
import play.api.cache.Cache
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick._
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}

import scala.slick.lifted.TableQuery

class VisualizationApi(implicit inj: Injector) extends Controller with Injectable {

  def queries(id: Long, permalinkToken: String) = DBAction { implicit rs =>
    val query = VisualizationQueries.findByIdAndToken(id, permalinkToken)
    query.map(q => Ok(q.storedData)).getOrElse(NotFound)
  }

  def getCachedResult(id: Long, permalinkToken: String) = Action { r =>
    val mayBeResult = Cache.getAs[JsValue](jsonCacheKey(id, permalinkToken))
    Ok(mayBeResult.getOrElse(JsObject(Seq(("error", JsString("notfound"))))))
  }

  def addDataSource(endpointUri: String, graphUri: String) = DBAction { implicit rs =>
    val dataSources = TableQuery[DataSources]
    val did = (dataSources returning dataSources.map(_.id)) += DataSource(1, "anonymous", endpointUri, Some(graphUri))

    Ok(JsNumber(did))
  }

  def addVisualization(dataDataSource: Long, dsdDataSource: Long) = DBAction { implicit rs =>
    val visualizations = TableQuery[Visualizations]
    val vid = (visualizations returning visualizations.map(_.id)) += Visualization(2, "anonymous", dataDataSource, dsdDataSource)

    Ok(JsNumber(vid))
  }

  def addPayola(evaluationId: String) = DBAction { implicit rs =>
    val dataSources = TableQuery[DataSources]
    val endpointUri = "http://live.payola.cz:8890/sparql"
    val did = (dataSources returning dataSources.map(_.id)) += DataSource(1, "Payola "+evaluationId, endpointUri, Some("http://"+evaluationId))

    val visualizations = TableQuery[Visualizations]
    val vid = (visualizations returning visualizations.map(_.id)) += Visualization(2, "Payola "+evaluationId, did, did)

    Redirect("/visualize/datacube#/id/"+vid)
  }

}
