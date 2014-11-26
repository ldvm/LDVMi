package model.rdf.sparql.geo.query

import model.rdf.sparql.query.SparqlQuery


class PolygonEntitiesPropertiesQuery extends SparqlQuery {

  def get: String = prefixes +
    """
      | SELECT DISTINCT ?p ?l ?spl ?sn WHERE {
      |   ?s <http://www.opengis.net/ont/geosparql#hasGeometry> [
      |     <http://www.opengis.net/ont/geosparql#asWKT> []
      |   ] ;
      |     ?p [] .
      |
      |   OPTIONAL { ?p skos:prefLabel ?spl . }
      |   OPTIONAL { ?p rdfs:label ?l . }
      |   OPTIONAL { ?p skos:notion ?sn . }
      |
      |   FILTER(?p != <http://www.opengis.net/ont/geosparql#hasGeometry>)
      |   FILTER(?p != <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/geometry>)
      |   FILTER(?p != <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/inspireId>)
      |   FILTER(?p != <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/siteDesignation>)
      |   FILTER(?p != <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/siteName>)
      |   FILTER(?p != skos:prefLabel)
      | }
    """.stripMargin

  private def prefixes =
    """
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      |
    """.stripMargin

}


object PolygonEntitiesPropertiesQuery {

  object NodeVariables extends Enumeration {
    type NodeVariables = Value
    val VALUE_PROPERTY_VARIABLE = Value("p")
  }

  object LabelVariables extends Enumeration {
    type LabelVariables = Value
    val VALUE_NOTION_VARIABLE = Value("sn")
    val VALUE_PREFLABEL_VARIABLE = Value("spl")
    val VALUE_LABEL_VARIABLE = Value("l")
  }

}