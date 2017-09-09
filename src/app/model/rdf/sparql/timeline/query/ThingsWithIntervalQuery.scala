package model.rdf.sparql.timeline.query

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class ThingsWithIntervalQuery(maybeThingsUrls: Option[Seq[String]],
                              maybeThingsTypes: Option[Seq[String]],
                              maybePredicates: Option[Seq[String]],
                              maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT DISTINCT ?thing ?thingType ?predicate ?interval"
    val group = "GROUP BY ?thing ?thingType ?predicate ?interval"
    val limit = QueryHelpers.limit(maybeLimit)
    return query(select, group, limit)
  }

  def getCount: String = {
    val select = "SELECT (count(distinct(?thing)) AS ?count)"
    val group = ""
    val limit = ""
    return query(select, group, limit)
  }

  private def query(select: String, group: String, limit: String): String =
    s"""
       |PREFIX time: <http://www.w3.org/2006/time#>
       |
       |${select}
       |WHERE {
       |  ?thing ?predicate ?interval.
       |  ?thing a ?thingType.
       |
       |  # Ensuring lower levels contain data
       |  FILTER EXISTS {
       |    ?interval time:hasBeginning ?beginning .
       |    ?interval time:hasEnd ?end .
       |  }
       |
       |  # Limiting values to configurations and higher levels
       |  ${QueryHelpers.limitValues("thing", maybeThingsUrls)}
       |  ${QueryHelpers.limitValues("thingType", maybeThingsTypes)}
       |  ${QueryHelpers.limitValues("predicate", maybePredicates)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}
