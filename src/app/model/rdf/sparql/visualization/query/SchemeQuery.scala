package model.rdf.sparql.visualization.query

import model.rdf.sparql.query.SparqlQuery

class SchemeQuery(schemeUri: String) extends SparqlQuery {

  def get: String = {

    val broader = broaderPattern("skos:broader")
    val broaderTransitive = broaderPattern("skos:broaderTransitive")
    val narrower = narrowerPattern("skos:narrower")
    val narrowerTransitive = narrowerPattern("skos:narrowerTransitive")

    s"""
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      | PREFIX dct: <http://purl.org/dc/terms/>
      |
      | CONSTRUCT {
      |
      |   <$schemeUri> skos:prefLabel ?prefLabel ;
      |                dct:title ?dcLabel ;
      |                rdfs:label ?label .
      |
      |   ?ca a skos:Concept ;
      |      skos:prefLabel ?name ;
      |      rdf:value ?size ;
      |      skos:inScheme <$schemeUri> ;
      |      skos:broader ?broader .
      |
      |   ?broader a skos:Concept ;
      |      dct:title ?bDctName ;
      |      skos:prefLabel ?bName .
      |
      |   ?narrower a skos:Concept ;
      |      dct:title ?nDctName ;
      |      skos:prefLabel ?nName ;
      |      skos:broader ?ca .
      | }
      | WHERE
      | {
      |   OPTIONAL { <$schemeUri> skos:prefLabel ?prefLabel . }
      |   OPTIONAL { <$schemeUri> rdfs:label ?label . }
      |   OPTIONAL { <$schemeUri> dct:title ?dcLabel . }
      |   $broader UNION $broaderTransitive UNION $narrower UNION $narrowerTransitive
      | }
    """.stripMargin
  }

  private def broaderPattern(property: String): String = {
    s"""{
       |   ?ca a skos:Concept ;
       |      skos:inScheme <$schemeUri> .
       |
       |   OPTIONAL {
       |      ?ca skos:prefLabel ?name .
       |   }
       |
       |   OPTIONAL {
       |     ?ca $property ?broader .
       |     ?broader a skos:Concept .
       |
       |     OPTIONAL { ?broader dct:title ?bDctName . }
       |     OPTIONAL { ?broader skos:prefLabel ?bName . }
       |
       |   }
       |
       |   OPTIONAL { ?ca rdf:value ?size. }
       |
       | }
    """.stripMargin
  }

  private def narrowerPattern(property: String): String = {
    s"""{
      |   ?ca a skos:Concept ;
      |      skos:inScheme <$schemeUri> .
      |
      |   OPTIONAL {
      |      ?ca skos:prefLabel ?name .
      |   }
      |
      |   OPTIONAL {
      |     ?ca $property ?narrower .
      |     ?narrower a skos:Concept .
      |
      |     OPTIONAL { ?narrower dct:title ?nDctName . }
      |     OPTIONAL { ?narrower skos:prefLabel ?nName . }
      |
      |   }
      |
      |   OPTIONAL { ?ca rdf:value ?size. }
      |
      | }
    """.stripMargin
  }

}