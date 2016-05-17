package model.rdf.sparql.rgml.query

import model.rdf.sparql.query.SparqlQuery

class NodesWithDegreeQuery extends SparqlQuery {

  def get: String =
    """
		  | PREFIX rgml: <http://purl.org/puninj/2001/05/rgml-schema#>
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		  | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      |
      | CONSTRUCT {
      |	  ?node	rdf:type rgml:Node ;
      |     rdfs:label ?label ;
      |     rgml:inDegree ?inDegree ;
      |     rgml:outDegree ?outDegree.
      |	}
      |	WHERE {
      |   SELECT ?node ?label
      |     (COUNT(?edgeOut) AS ?outDegree)
      |     (COUNT(?edgeIn) AS ?inDegree)
      |   WHERE {
      |	    ?node	rdf:type rgml:Node .
      |     OPTIONAL { ?node rdfs:label ?label }
      |     OPTIONAL { ?edgeOut rgml:source ?node . }
      |     OPTIONAL { ?edgeIn rgml:target ?node . }
      |   }
      |   GROUP BY ?node ?label
      |	}
    """
      .stripMargin
}
