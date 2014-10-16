package model.services.rdf.sparql.datacube.query

import model.services.rdf.sparql.query.SparqlQuery


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

  object NodeVariables extends Enumeration {
    type NodeVariables = Value
    val VALUE_PROPERTY_VARIABLE = Value("o")
  }

  object LabelVariables extends Enumeration {
    type LabelVariables = Value
    val VALUE_LABEL_VARIABLE = Value("l")
    val VALUE_PREFLABEL_VARIABLE = Value("spl")
    val VALUE_NOTION_VARIABLE = Value("sn")
  }

}
