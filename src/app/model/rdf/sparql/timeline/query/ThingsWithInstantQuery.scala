package model.rdf.sparql.timeline.query

import model.rdf.sparql.query.SparqlCountQuery

class ThingsWithInstantQuery(maybeThingsUrls: Option[Seq[String]],
                             maybeThingsTypes: Option[Seq[String]],
                             maybeConnectionUrls: Option[Seq[String]],
                             maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?thing ?thingType ?connection ?instant"
    val group = "GROUP BY ?thing ?thingType ?connection ?instant"
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
       |  ?thing ?connection ?instant.
       |  ?thing a ?thingType.
       |
       |  ?instant time:inDateTime ?date.
       |
       |  ${QueryHelpers.limitValues("thing", maybeThingsUrls)}
       |  ${QueryHelpers.limitValues("thingType", maybeThingsTypes)}
       |  ${QueryHelpers.limitValues("connection", maybeConnectionUrls)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}