package services.data.rdf.sparql.datacube.query

import services.data.rdf.sparql.query.SparqlQuery


class DataCubeValuesQuery(val uri: String) extends SparqlQuery {

  def get: String =
    """
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      |
      | SELECT DISTINCT ?o ?l ?spl ?sn WHERE {
      |     [] <@s> ?o .
      |
      |     OPTIONAL { ?o skos:prefLabel ?spl . }
      |     OPTIONAL { ?o rdfs:label ?l . }
      |     OPTIONAL { ?o skos:notion ?sn . }
      | }
    """.stripMargin.replaceAll("[\n\r]", "").replace("@s", uri)

}

object DataCubeValuesQuery {

  val VALUE_PROPERTY_VARIABLE = "o"
  val VALUE_LABEL_VARIABLE = "l"
  val VALUE_PREFLABEL_VARIABLE = "spl"
  val VALUE_NOTION_VARIABLE = "sn"

}
