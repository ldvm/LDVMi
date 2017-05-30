package model.rdf.sparql.geo.query

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class ThingWithPlaceQuery(maybeThingUrls: Option[Seq[String]],
                          maybeThingTypes: Option[Seq[String]],
                          maybeConnections: Option[Seq[String]],
                          maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?thing ?thingType ?connection ?place"
    val group = "GROUP BY ?thing ?thingType ?connection ?place"
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
       |PREFIX s: <http://schema.org/>
       |
       |${select}
       |WHERE {
       |  ?thing a ?thingType;
       |    ?connection ?place ;
       |
       |  FILTER EXISTS {
       |    ?place s:geo ?coordinates .
       |  }
       |
       |  ${QueryHelpers.limitValues("thing", maybeThingUrls)}
       |  ${QueryHelpers.limitValues("thingType", maybeThingTypes)}
       |  ${QueryHelpers.limitValues("connection", maybeConnections)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}