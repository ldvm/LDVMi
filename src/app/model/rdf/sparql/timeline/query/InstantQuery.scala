package model.rdf.sparql.timeline.query

import java.util.Date

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class InstantQuery(maybeStart: Option[Date], maybeEnd: Option[Date], maybeInstantUrls: Option[Seq[String]], maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT DISTINCT ?instant ?date ?hour ?minute ?second"
    val group = "GROUP BY ?instant ?date ?hour ?minute ?second"
    val limit = QueryHelpers.limit(maybeLimit)
    return query(select, group, limit)
  }

  def getCount: String = {
    val select = "SELECT (count(distinct(?instant)) AS ?count)"
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
       |  ?instant time:inDateTime ?date_url.
       |
       |  # Time is optional, the main value lies in the date
       |  OPTIONAL { ?date_url time:hour ?hour }
       |  OPTIONAL { ?date_url time:minute ?minute }
       |  OPTIONAL { ?date_url time:second ?second }
       |  OPTIONAL { ?date_url time:timeZone ?zone }
       |
       |  # Construct XSD date (which can be compared) from the time: properties
       |  ${QueryHelpers.bindTimeDescriptionToXSDDate("date_url", "date")}
       |
       |  # Load data between start and end of the required interval
       |  ${startFilter}
       |  ${endFilter}
       |
       |  # Limiting values to configurations and higher levels
       |  ${QueryHelpers.limitValues("instant", maybeInstantUrls)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin

  private def startFilter: String = {
    maybeStart match {
      case Some(start) => {
        return s"""FILTER ( ?date > xsd:date("${QueryHelpers.dateToString(start)}"))""".stripMargin
      }
      case None => ""
    }
  }

  private def endFilter: String = {
    maybeEnd match {
      case Some(end) => {
        return s"""FILTER ( ?date < xsd:date("${QueryHelpers.dateToString(end)}"))""".stripMargin
      }
      case None => ""
    }
  }
}