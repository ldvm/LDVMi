package model.rdf.sparql.timeline.query

import java.util.Date

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class IntervalQuery(maybeStart: Option[Date], maybeEnd: Option[Date], maybeIntervalUrls: Option[Seq[String]], maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?interval ?begin ?end"
    val group = "GROUP BY ?interval ?begin ?end"
    val limit = QueryHelpers.limit(maybeLimit)
    return query(select, group, limit)
  }

  def getCount: String = {
    val select = "SELECT (count(distinct(?interval)) AS ?count)"
    val group = ""
    val limit = ""
    return query(select, group, limit)
  }

  private def query(select: String, group: String, limit: String): String =
    s"""
       |PREFIX time: <http://www.w3.org/2006/time#>
       |PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
       |
       |${select}
       |WHERE {
       |  ?interval time:hasBeginning ?begin_desc .
       |  ?interval time:hasEnd ?end_desc .
       |
       |  ?begin_desc time:inDateTime ?begin_url.
       |  ?end_desc   time:inDateTime ?end_url.
       |
       |  ${QueryHelpers.bindTimeDescriptionToXSDDate("begin_url", "begin")}
       |  ${QueryHelpers.bindTimeDescriptionToXSDDate("end_url", "end")}
       |
       |  ${startFilter}
       |  ${endFilter}
       |
       |  ${QueryHelpers.limitValues("interval", maybeIntervalUrls)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin

  private def startFilter: String = {
    maybeStart match {
      case Some(start) => {
        return s"""FILTER ( ?begin > xsd:date("${QueryHelpers.dateToString(start)}"))""".stripMargin
      }
      case None => ""
    }
  }

  private def endFilter: String = {
    maybeEnd match {
      case Some(end) => {
        return s"""FILTER ( ?end < xsd:date("${QueryHelpers.dateToString(end)}"))""".stripMargin
      }
      case None => ""
    }
  }
}