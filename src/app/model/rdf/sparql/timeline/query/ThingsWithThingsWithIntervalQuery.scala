package model.rdf.sparql.timeline.query

import model.rdf.sparql.QueryHelpers
import model.rdf.sparql.query.SparqlCountQuery

class ThingsWithThingsWithIntervalQuery(maybeThingsUrls: Option[Seq[String]],
                                        maybeThingsTypes: Option[Seq[String]],
                                        maybeConnectionUrls: Option[Seq[String]],
                                        maybeLimit: Option[Int]) extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?outerThing ?outerThingType ?connection ?innerThing"
    val group = "GROUP BY ?outerThing ?outerThingType ?connection ?innerThing"
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
       |  ?outerThing ?connection ?innerThing.
       |
       |  ?outerThing a ?outerThingType.
       |
       |  ?innerThing ?hasInterval ?interval.
       |
       |  ?interval time:hasBeginning ?beginning .
       |  ?interval time:hasEnd ?end .
       |
       |  ${QueryHelpers.limitValues("outerThing", maybeThingsUrls)}
       |  ${QueryHelpers.limitValues("outerThingType", maybeThingsTypes)}
       |  ${QueryHelpers.limitValues("connection", maybeConnectionUrls)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}
