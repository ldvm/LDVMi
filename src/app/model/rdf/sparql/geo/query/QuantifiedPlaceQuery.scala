package model.rdf.sparql.geo.query

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class QuantifiedPlaceQuery(maybePlaceUrls: Option[Seq[String]],
                           maybePlaceTypes: Option[Seq[String]],
                           maybeValuePredicates: Option[Seq[String]],
                           maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?place ?placeType ?valuePredicate ?value ?coordinates"
    val group = "GROUP BY ?place ?placeType ?valuePredicate ?value ?coordinates"
    val limit = QueryHelpers.limit(maybeLimit)
    return query(select, group, limit)
  }

  def getCount: String = {
    val select = "SELECT (count(distinct(?place)) AS ?count)"
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
       |  ?place a ?placeType ;
       |    s:geo ?coordinates ;
       |    ?valuePredicate ?value .
       |
       |  # Ensuring lower levels contain data
       |  FILTER EXISTS {
       |    ?coordinates s:longitude ?longitude ;
       |      s:latitude ?latitude .
       |  }
       |
       |  FILTER(ISNUMERIC(?value))
       |
       |  # Restricting values to configurations and higher levels
       |  ${QueryHelpers.limitValues("place", maybePlaceUrls)}
       |  ${QueryHelpers.limitValues("placeType", maybePlaceTypes)}
       |  ${QueryHelpers.limitValues("valuePredicate", maybeValuePredicates)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}