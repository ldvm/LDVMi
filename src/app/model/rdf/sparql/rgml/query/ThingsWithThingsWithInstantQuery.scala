package model.rdf.sparql.rgml.query

import model.rdf.sparql.query.{SparqlCountQuery, SparqlQuery}

class ThingsWithThingsWithInstantQuery(maybeThingsUrls: Option[Seq[String]], maybeConnectionUrls: Option[Seq[String]], maybeLimit: Option[Integer]) extends SparqlQuery with SparqlCountQuery {

  def get: String = {
    val select = "SELECT ?outerThing ?connection ?innerThing"
    val group  = "GROUP BY ?outerThing ?connection ?innerThing"
    val limit = QueryHelpers.limit(maybeLimit)
    return query(select,group,limit)
  }

  def getCount: String = {
    val select = "COUNT(?thing) AS ?count"
    val group = ""
    val limit = ""
    return query(select,group,limit)
  }

  private def query(select:String, group:String, limit: String) : String =
    s"""
       |PREFIX time: <http://www.w3.org/2006/time#>
       |
       |${select}
       |WHERE {
       |  ?outerThing ?connection ?innerThing.
       |
       |  ?innerThing ?hasInterval ?instant.
       |
       |  ?instant time:inXSDDateTime ?date.
       |
       |  ${QueryHelpers.limitValues("outerThing", maybeThingsUrls)}
       |  ${QueryHelpers.limitValues("connection", maybeConnectionUrls)}
       |}
       |
       |${group}
       |${limit}
    """
      .stripMargin
}