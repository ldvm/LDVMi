package model.rdf.sparql.visualization.query

import model.rdf.sparql.query.SparqlQuery

class ConceptCountQuery(propertyUri: String, conceptUri: String) extends SparqlQuery {

  def get: String =
    s"""
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      |
      | SELECT (COUNT(?x) as ?count)
      | WHERE
      | {
      |   ?x <$propertyUri> <$conceptUri> .
      | }
    """
      .stripMargin
}
