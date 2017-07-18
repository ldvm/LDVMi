package model.rdf.sparql.timeline.query

import java.util.Date

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class IntervalQuery(maybeStart: Option[Date], maybeEnd: Option[Date], maybeIntervalUrls: Option[Seq[String]], maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT DISTINCT ?interval ?begin ?begin_hour ?begin_minute ?begin_second ?end ?end_hour ?end_minute ?end_second"
    val group = "GROUP BY ?interval ?begin ?begin_hour ?begin_minute ?begin_second ?end ?end_hour ?end_minute ?end_second"
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
       |  # Time is optional, the main value lies in the date
       |  OPTIONAL { ?begin_url time:hour ?begin_hour }
       |  OPTIONAL { ?begin_url time:minute ?begin_minute }
       |  OPTIONAL { ?begin_url time:second ?begin_second }
       |  OPTIONAL { ?begin_url time:timeZone ?begin_zone }
       |
       |  OPTIONAL { ?end_url time:hour ?begin_hour }
       |  OPTIONAL { ?end_url time:minute ?begin_minute }
       |  OPTIONAL { ?end_url time:second ?begin_second }
       |  OPTIONAL { ?end_url time:timeZone ?end_zone }
       |
       |  # Construct XSD date (which can be compared) from the time: properties
       |  ${QueryHelpers.bindTimeDescriptionToXSDDate("begin_url", "begin")}
       |  ${QueryHelpers.bindTimeDescriptionToXSDDate("end_url", "end")}
       |
       |  # Load data between start and end of the required interval
       |  ${startFilter}
       |  ${endFilter}
       |
       |  # Limiting values to configurations and higher levels
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