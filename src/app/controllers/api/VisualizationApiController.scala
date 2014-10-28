package controllers.api

import model.dao.{DataSource, Visualization}
import model.services._
import play.api.Play.current
import play.api.cache.Cache
import play.api.db.slick._
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}

class VisualizationApiController(implicit inj: Injector) extends Controller with Injectable {

  val visualizationService = inject[VisualizationService]
  val dataSourceService = inject[DataSourceService]
  val visualizationQueriesService = inject[VisualizationQueriesService]
  val ldvmService = inject[LDVMService]
  val compatibilityService = inject[CompatibilityService]

  def get(id: Long) = DBAction { implicit rs =>
    val entity = visualizationService.getByIdWithEager(id)
    Ok(Json.toJson(entity))
  }

  def queries(id: Long, permalinkToken: String) = DBAction { implicit rs =>
    val query = visualizationQueriesService.findByIdAndToken(id, permalinkToken)
    query.map(q => Ok(q.storedData)).getOrElse(NotFound)
  }

  def getCachedResult(id: Long, permalinkToken: String) = Action { r =>
    val mayBeResult = Cache.getAs[JsValue](jsonCacheKey(id, permalinkToken))
    Ok(mayBeResult.getOrElse(JsObject(Seq(("error", JsString("notfound"))))))
  }

  def addDataSource(endpointUri: String, graphUri: Option[String] = None, name: String = "anonymous") = DBAction { implicit rs =>
    val did = dataSourceService.insertAndGetId(DataSource(1, name, endpointUri, graphUri))

    Ok(JsObject(Seq(("id", JsNumber(did)))))
  }

  def addVisualization(dataDataSource: Long, dsdDataSource: Long, name: Option[String]) = DBAction { implicit rs =>
    val vid = visualizationService.insertAndGetId(Visualization(2, name.getOrElse("anonymous"), dataDataSource, dsdDataSource))

    Ok(JsObject(Seq(("id", JsNumber(vid)))))
  }

  def addPayola(evaluationId: String) = DBAction { implicit rs =>

    val endpointUri = "http://live.payola.cz:8890/sparql"
    val did = dataSourceService.insertAndGetId(DataSource(1, "Payola " + evaluationId, endpointUri, Some("http://" + evaluationId)))
    val vid = visualizationService.insertAndGetId(Visualization(2, "Payola " + evaluationId, did, did))

    Redirect("/visualize/datacube#/id/" + vid)
  }

  def list(skip: Int = 0, take: Int = 10) = DBAction { implicit rs =>

    val count = visualizationService.count

    Ok(JsObject(
      Seq(
        ("count", JsNumber(count)),
        ("data", Json.toJson(visualizationService.listWithEager(skip, take)))
      )
    ))
  }

  def checkCompatibility(id: Long) = DBAction { implicit s =>
    ldvmService.checkVisualizationCompatibility(id)
    Ok("")
  }

  def getCompatibilityForVisualization(id: Long) = DBAction { implicit s =>
    val entities = compatibilityService.getByVisualizationId(id)
    Ok(Json.toJson(entities))
  }

}
