package model.rdf.sparql.visualization.query

import model.rdf.sparql.query.SparqlQuery

class ConceptsQuery extends SparqlQuery {

  def get: String =
    """
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      |
      | CONSTRUCT {
      |   ?c a skos:Concept ;
      |      skos:inScheme ?s ;
      |      skos:prefLabel ?l ;
      |      skos:broader ?b ;
      |      skos:broaderTransitive ?bt ;
      |      skos:narrower ?n ;
      |      skos:narrowerTransitive ?nt .
      | }
      | WHERE
      | {
      |   ?c a skos:Concept .
      |
      |   OPTIONAL {
      |     ?c skos:inScheme ?s .
      |   }
      |
      |   OPTIONAL {
      |     ?c skos:prefLabel ?l .
      |   }
      |
      |   OPTIONAL {
      |     ?c skos:broader ?b .
      |   }
      |
      |   OPTIONAL {
      |     ?c skos:broaderTransitive ?bt .
      |   }
      |
      |   OPTIONAL {
      |     ?c skos:narrower ?n .
      |   }
      |
      |   OPTIONAL {
      |     ?c skos:narrowerTransitive ?nt .
      |   }
      | }
    """
      .stripMargin
}
