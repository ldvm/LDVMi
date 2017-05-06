package model.rdf.sparql.rgml.query

import java.util.Date
import model.rdf.sparql.query.{SparqlCountQuery}

class IntervalQuery(maybeStart: Option[Date], maybeEnd: Option[Date], maybeIntervalUrls: Option[Seq[String]], maybeLimit: Option[Int])  extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?interval ?begin ?end"
    val group  = "GROUP BY ?interval ?begin ?end"
    val limit = QueryHelpers.limit(maybeLimit)
    return query(select,group,limit)
  }

  def getCount: String = {
    val select = "SELECT COUNT(?interval) AS ?count"
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
       |  ?interval time:hasBeginning ?begin_url .
       |  ?interval time:hasEnd ?end_url .
       |
       |  ?begin_url time:inXSDDateTime ?begin.
       |  ?end_url time:inXSDDateTime ?end.
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
    maybeStart match {
      case Some(start) => {
        return s"""FILTER (xsd:dateTime(?begin) > xsd:dateTime("${QueryHelpers.dateToString(start)}"))"""
      }
      case None => ""
    }
  }

  private def endFilter: String = {
    maybeEnd match {
      case Some(end) => {
        return s"""FILTER (xsd:dateTime(?end) < xsd:dateTime("${QueryHelpers.dateToString(end)}"))"""
      }
      case None => ""
    }
  }
}