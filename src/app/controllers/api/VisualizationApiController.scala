package controllers.api

import controllers.api.JsonImplicits._
import model.entity.PipelineEvaluationQuery
import model.rdf.sparql.datacube.DataCubeQueryData
import play.api.Play.current
import play.api.cache.Cache
import play.api.db.slick.{DBAction, _}
import play.api.libs.json._
import play.api.mvc._
import scaldi.{Injectable, Injector}
import utils.MD5

class VisualizationApiController(implicit inj: Injector) extends ApiController with Injectable {

  def getCachedResult(id: Long, permalinkToken: String) = Action { r =>
    val mayBeResult = Cache.getAs[JsValue](jsonCacheKey(id, permalinkToken))
    Ok(mayBeResult.getOrElse(JsObject(Seq(("error", JsString("notfound"))))))
  }

  def tree(id: Long) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      Ok(Json.toJson(visualizationService.hierarchy(evaluation)))
    }
  }

  def dataReferences(id: Long) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      Ok(Json.toJson(visualizationService.dataReferences(evaluation)))
    }
  }

  def queries(id: Long, permalinkToken: String) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      val query = pipelineService.findQueryByIdAndToken(evaluation.id.get, permalinkToken)
      query.map(q => Ok(q.storedData)).getOrElse(NotFound)
    }
  }

  def customCube(id: Long, permalinkToken: String, dimensionUri: String, valueUri: String) = DBAction { implicit rs =>
    withEvaluation(id) { evaluation =>
      val query = pipelineService.findQueryByIdAndToken(evaluation.id.get, permalinkToken)
      query.map { q =>
        val json = Json.parse(q.storedData)
        val result = json.validate[DataCubeQueryData]

        result match {
          case s: JsSuccess[DataCubeQueryData] => {

            val data = s.get

            val dataCopy = data.copy(data.filters.copy(components = data.filters.components.map { c =>
              if (c.componentUri != dimensionUri) {
                c
              } else {
                c.copy(values = c.values.map { v =>
                  v.copy(isActive = v.uri.map(_ == valueUri))
                })
              }
            }))

            val json = Json.toJson(dataCopy)
            val jsonString = json.toString()

            val token = MD5.hash(jsonString)
            val copy = q.copy(id = None, token = token, storedData = jsonString)
            qr.save(copy)

            Redirect("/visualize/datacube#/id/"+id+"/?p="+token)
          }
          case e: JsError => NotFound
        }
      }.getOrElse(NotFound)
    }
  }

}