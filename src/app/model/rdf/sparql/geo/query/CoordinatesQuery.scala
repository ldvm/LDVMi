package model.rdf.sparql.geo.query

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class CoordinatesQuery(maybeCoordinatesUrls: Option[Seq[String]], maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?coordinates ?longitude ?latitude"
    val group = "GROUP BY ?coordinates ?longitude ?latitude"
    val limit = QueryHelpers.limit(maybeLimit)
    return query(select, group, limit)
  }

  def getCount: String = {
    val select = "SELECT (count(distinct(?coordinates)) AS ?count)"
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
       |  ?coordinates s:longitude ?longitude ;
       |    s:latitude ?latitude .
       |
       |  # Restricting values to configurations and higher levels
       |  ${QueryHelpers.limitValues("coordinates", maybeCoordinatesUrls)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}