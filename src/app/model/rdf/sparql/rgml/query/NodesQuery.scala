package model.rdf.sparql.rgml.query

import model.rdf.sparql.query.SparqlQuery

class NodesQuery extends SparqlQuery {

  def get: String =
    """
		  | PREFIX rgml: <http://purl.org/puninj/2001/05/rgml-schema#>
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		  | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      |
      |	CONSTRUCT {
      |	  ?node	rdf:type rgml:Node ;
      |     rdfs:label ?label .
      |	}
      |	WHERE {
      |	  ?node	rdf:type rgml:Node .
      |
      |   OPTIONAL { ?node rdfs:label ?label }
      |	}
    """
      .stripMargin
}
