package model.rdf.sparql.visualization.query

import model.rdf.sparql.query.SparqlQuery

class HierarchyQuery(schemeUri: String) extends SparqlQuery {

  def get: String =
    """
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      |
      | construct {
      |   ?ca a skos:Concept ;
      |      skos:prefLabel ?name ;
      |      rdf:value ?size ;
      |      skos:inScheme <%u> ;
      |      skos:broader ?broader .
      |
      |   ?broader a skos:Concept ;
      |      skos:prefLabel ?bname .
      | }
      | where
      | {
      |   ?ca a skos:Concept ;
      |      skos:prefLabel ?name ;
      |      skos:inScheme <%u> ;
      |      skos:broader ?broader.
      |
      |   ?broader a skos:Concept ;
      |      skos:prefLabel ?bname .
      |
      |      OPTIONAL { ?ca rdf:value ?size. }
      | }
    """
      .replaceAll("%u", schemeUri)
      .stripMargin

}
