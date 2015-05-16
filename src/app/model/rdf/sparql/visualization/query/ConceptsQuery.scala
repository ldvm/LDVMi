package model.rdf.sparql.visualization.query

import model.rdf.sparql.query.SparqlQuery

class ConceptsQuery(schemeUri: String) extends SparqlQuery {

  def get: String =
    """
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      |
      | CONSTRUCT {
      |   ?c a skos:Concept ;
      |      skos:inScheme <%u> ;
      |      skos:prefLabel ?l .
      | }
      | WHERE
      | {
      |   ?c a skos:Concept ;
      |      skos:inScheme <%u> ;
      |      skos:prefLabel ?l .
      | }
    """
      .stripMargin
      .replaceAll("%u", schemeUri)
}
