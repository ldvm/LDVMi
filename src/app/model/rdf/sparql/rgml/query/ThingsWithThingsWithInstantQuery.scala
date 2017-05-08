package model.rdf.sparql.rgml.query

import model.rdf.sparql.query.{SparqlCountQuery}

class ThingsWithThingsWithInstantQuery(maybeThingsUrls: Option[Seq[String]],
                                       maybeThingsTypes: Option[Seq[String]],
                                       maybeConnectionUrls: Option[Seq[String]],
                                       maybeLimit: Option[Int])  extends SparqlCountQuery {
  def get: String = {
    val select = "SELECT ?outerThing ?outerThingType ?connection ?innerThing"
    val group  = "GROUP BY ?outerThing ?outerThingType ?connection ?innerThing"
    val limit = QueryHelpers.limit(maybeLimit)
    return query(select,group,limit)
  }

  def getCount: String = {
    val select = "SELECT COUNT(?outerThing) AS ?count"
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
       |  ?outerThing a ?outerThingType.
       |
       |  ?innerThing ?hasInterval ?instant.
       |
       |  ?instant time:inXSDDateTime ?date.
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