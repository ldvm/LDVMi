package model.rdf.sparql.visualization.query

import model.rdf.sparql.query.SparqlQuery

class SchemeQuery(schemeUri: String) extends SparqlQuery {

  def get: String = {

    val broader = broaderPattern("skos:broader")
    val broaderTransitive = broaderPattern("skos:broaderTransitive")
    val narrower = broaderPattern("skos:narrower")
    val narrowerTransitive = broaderPattern("skos:narrowerTransitive")

    s"""
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      |
      | CONSTRUCT {
      |   ?ca a skos:Concept ;
      |      skos:prefLabel ?name ;
      |      rdf:value ?size ;
      |      skos:inScheme <$schemeUri> ;
      |      skos:broader ?broader .
      |
      |   ?broader a skos:Concept ;
      |      skos:prefLabel ?bname .
      | }
      | WHERE
      | {
      |  $broader UNION $broaderTransitive UNION $narrower UNION $narrowerTransitive
      | }
    """.stripMargin
  }

  private def pattern(triple: String) : String = {
    s"""{
      |   ?ca a skos:Concept ;
      |      skos:inScheme <$schemeUri> .
      |
      |   OPTIONAL {
      |      ?ca skos:prefLabel ?name .
      |   }
      |
      |   OPTIONAL {
      |     $triple
      |     ?broader a skos:Concept .
      |
      |     OPTIONAL {
      |        ?broader skos:prefLabel ?bname .
      |     }
      |
      |   }
      |
      |   OPTIONAL { ?ca rdf:value ?size. }
      |
      | }"""
  }

  private def broaderPattern(property: String): String = {
    pattern(s"?ca $property ?broader .")
  }

  private def narrowerPattern(property: String): String = {
    pattern(s"?broader $property ?ca .")
  }

}
