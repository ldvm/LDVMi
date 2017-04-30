package model.rdf.sparql.rgml.query

import java.util.Date
import java.text.SimpleDateFormat

import model.rdf.sparql.query.{SparqlCountQuery, SparqlQuery}

class IntervalQuery(maybeStart: Option[Date], maybeEnd: Option[Date], maybeIntervalUrls: Option[Seq[String]], maybeLimit: Option[Integer]) extends SparqlQuery with SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?interval ?start ?end"
    val group  = "GROUP BY ?interval ?start ?end"
    val limit = QueryHelpers.limit(maybeLimit)
    return query(select,group,limit)
  }

  def getCount: String = {
    val select = "COUNT(?interval) AS ?count"
    val group = ""
    val limit = ""
    return query(select, group, limit)
  }

  private def query(select:String, group:String, limit: String) : String =
    s"""
       |PREFIX time: <http://www.w3.org/2006/time#>
       |PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
       |
       |${select}
       |WHERE {
       |  ?interval time:hasBeginning ?beginning .
       |  ?interval time:hasEnd ?end .
       |
       |  ${startFilter}
       |  ${endFilter}
       |
       |  ${QueryHelpers.limitValues("interval",maybeIntervalUrls)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin


  private def startFilter: String = {
    val dateFormat = new SimpleDateFormat("YYYY-MM-DD")
    maybeStart match {
      case Some(start) => {
        val startString = dateFormat.format(start)
        return s"""FILTER (xsd:dateTime(?begin) > xsd:dateTime("$startString"))"""
      }
      case None => ""
    }
  }

  private def endFilter: String = {
    val dateFormat = new SimpleDateFormat("YYYY-MM-DD")
    maybeEnd match {
      case Some(end) => {
        val endString = dateFormat.format(end)
        return s"""FILTER (xsd:dateTime(?end) < xsd:dateTime("$endString"))"""
      }
      case None => ""
    }
  }
}