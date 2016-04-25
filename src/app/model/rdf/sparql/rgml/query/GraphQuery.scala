package model.rdf.sparql.rgml.query

import model.rdf.sparql.query.SparqlQuery

class GraphQuery extends SparqlQuery {

  def get: String =
    """
      |	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      |	PREFIX rgml: <http://purl.org/puninj/2001/05/rgml-schema#>
      |
      | SELECT ?directed ?nodeCount ?edgeCount WHERE {
      |   ?graph
      |     rdf:type rgml:Graph ;
      |     rgml:directed ?directed .
      |
      |   { SELECT (COUNT(*) AS ?nodeCount) WHERE { ?edge rdf:type rgml:Node . } }
      |   { SELECT (COUNT(*) AS ?edgeCount) WHERE { ?edge rdf:type rgml:Edge . } }
      | }
      | LIMIT 1
    """
      .stripMargin
}
