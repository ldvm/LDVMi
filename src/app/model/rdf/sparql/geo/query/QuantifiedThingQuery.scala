package model.rdf.sparql.geo.query

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class QuantifiedThingQuery(maybeThingUrls: Option[Seq[String]],
                           maybeValuePredicates: Option[Seq[String]],
                           maybePlacePredicates: Option[Seq[String]],
                           maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?thing ?valuePredicate ?value ?placePredicate ?place"
    val group = "GROUP BY ?thing ?valuePredicate ?value ?placePredicate ?place"
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
       |  ?thing ?placePredicate ?place ;
       |    ?valuePredicate ?value .
       |
       |  FILTER EXISTS {
       |    ?place s:geo ?coordinates .
       |  }
       |
       |  FILTER(ISNUMERIC(?value))
       |
       |  ${QueryHelpers.limitValues("thing", maybeThingUrls)}
       |  ${QueryHelpers.limitValues("valuePredicate", maybeValuePredicates)}
       |  ${QueryHelpers.limitValues("placePredicate", maybePlacePredicates)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}