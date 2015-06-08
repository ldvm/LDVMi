package model.rdf.sparql.visualization.query

import model.rdf.sparql.query.SparqlQuery

class SchemesQuery extends SparqlQuery {

  def get: String =
    """
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      |
      | CONSTRUCT {
      |   ?s a skos:ConceptScheme ;
      |      skos:prefLabel ?l .
      | }
      | WHERE {
      | {
      |    ?ca a skos:Concept;
      |        skos:inScheme ?s ;
      |        skos:broader ?broader.
      |
      |   ?s skos:prefLabel ?l;
      |      a skos:ConceptScheme .
      | } UNION
      | {
      |    ?ca a skos:Concept;
      |        skos:inScheme ?s ;
      |        skos:broaderTransitive ?broader.
      |
      |   ?s skos:prefLabel ?l;
      |      a skos:ConceptScheme .
      | }}
    """
      .stripMargin
}
