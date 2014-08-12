package controllers.api

import data.models.VisualizationQueries
import play.api._
import play.api.mvc._
import scaldi.{Injectable, Injector}
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.{ArrayNode, ObjectNode}
import play.api.db.slick._
import play.api.Play.current

import play.api.libs.json._
import Json._


import scaldi.{Injectable, Injector}

class VisualizationApi(implicit inj: Injector) extends Controller with Injectable {

  def queries(id: Long, permalinkToken: String) = DBAction { implicit rs =>
    val query = VisualizationQueries.findByIdAndToken(id, permalinkToken)
    query.map(q => Ok(q.storedData)).getOrElse(NotFound)

  }

}
