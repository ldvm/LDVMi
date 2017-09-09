package model.rdf.sparql.timeline.query

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class ThingsWithThingsWithInstantQuery(maybeThingsUrls: Option[Seq[String]],
                                       maybeThingsTypes: Option[Seq[String]],
                                       maybePredicates: Option[Seq[String]],
                                       maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT DISTINCT ?outerThing ?outerThingType ?predicate ?innerThing"
    val group = "GROUP BY ?outerThing ?outerThingType ?predicate ?innerThing"
    val limit = QueryHelpers.limit(maybeLimit)
    return query(select, group, limit)
  }

  def getCount: String = {
    val select = "SELECT (count(distinct(?outerThing)) AS ?count)"
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
       |  ?outerThing ?predicate ?innerThing.
       |
       |  ?outerThing a ?outerThingType.
       |
       |  # Ensuring lower levels contain data
       |  FILTER EXISTS {
       |    ?innerThing ?hasInterval ?instant.
       |    ?instant time:inDateTime ?date.
       |  }
       |
       |  # Restricting values to configurations and higher levels
       |  ${QueryHelpers.limitValues("outerThing", maybeThingsUrls)}
       |  ${QueryHelpers.limitValues("outerThingType", maybeThingsTypes)}
       |  ${QueryHelpers.limitValues("predicate", maybePredicates)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}