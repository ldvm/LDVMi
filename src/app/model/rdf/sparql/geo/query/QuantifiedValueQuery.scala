package model.rdf.sparql.geo.query

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class QuantifiedValueQuery(maybeThingsUrls: Option[Seq[String]],
                           maybeThingTypes: Option[Seq[String]],
                           maybeConnections: Option[Seq[String]],
                           maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?thing ?connection ?quantifier"
    val group = "GROUP BY ?thing ?connection ?quantifier"
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
       |  ?thing ?connection ?quantifier.
       |
       |  FILTER(ISNUMERIC(?quantifier))
       |
       |  ${QueryHelpers.limitValues("thing", maybeThingsUrls)}
       |  ${QueryHelpers.limitValues("connection", maybeThingTypes)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}