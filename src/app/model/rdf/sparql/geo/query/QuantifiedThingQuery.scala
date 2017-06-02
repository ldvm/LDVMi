package model.rdf.sparql.geo.query

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class QuantifiedThingQuery(maybeThingUrls: Option[Seq[String]],
                           maybeValueConnections: Option[Seq[String]],
                           maybePlaceConnections: Option[Seq[String]],
                           maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?thing ?valueConnection ?value ?placeConnection ?place"
    val group = "GROUP BY ?thing ?valueConnection ?value ?placeConnection ?place"
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
       |  ?thing ?placeConnection ?place ;
       |    ?valueConnection ?value .
       |
       |  FILTER EXISTS {
       |    ?place s:geo ?coordinates .
       |  }
       |
       |  FILTER(ISNUMERIC(?value))
       |
       |  ${QueryHelpers.limitValues("thing", maybeThingUrls)}
       |  ${QueryHelpers.limitValues("valueConnection", maybeValueConnections)}
       |  ${QueryHelpers.limitValues("placeConnection", maybePlaceConnections)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}