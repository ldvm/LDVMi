package model.rdf.sparql.geo.query

import model.rdf.sparql.query.SparqlQuery


class PolygonEntitiesPropertiesQuery extends SparqlQuery {

  def get: String = prefixes +
    """
      | SELECT DISTINCT ?scheme ?p ?l ?spl ?sn ?st ?sd ?dctt WHERE {
      |   ?s <http://www.opengis.net/ont/geosparql#hasGeometry> ?g ;
      |       ?p ?object .
      |   ?object a skos:Concept ;
      |       skos:inScheme ?scheme .
      |
      |   OPTIONAL { ?scheme skos:prefLabel ?spl . }
      |   OPTIONAL { ?scheme rdfs:label ?l . }
      |   OPTIONAL { ?scheme skos:notation ?sn . }
      |   OPTIONAL { ?scheme dcterms:title ?dctt . }
      |   OPTIONAL { ?scheme s:title ?st . }
      |   OPTIONAL { ?scheme s:description ?sd . }
      |
      | }
    """.stripMargin

  private def prefixes =
    """
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      | PREFIX s: <http://schema.org/>
      | PREFIX dcterms: <http://purl.org/dc/terms/>
      |
    """.stripMargin

}


object PolygonEntitiesPropertiesQuery {

  object NodeVariables extends Enumeration {
    type NodeVariables = Value
    val VALUE_SCHEME_VARIABLE = Value("scheme")
    val VALUE_PROPERTY_VARIABLE = Value("p")
  }

  object LabelVariables extends Enumeration {
    type LabelVariables = Value
    val VALUE_NOTION_VARIABLE = Value("sn")
    val VALUE_PREFLABEL_VARIABLE = Value("spl")
    val VALUE_LABEL_VARIABLE = Value("l")
    val VALUE_SCHEMA_LABEL_VARIABLE = Value("st")
    val VALUE_DCT_LABEL_VARIABLE = Value("dctt")
  }

}