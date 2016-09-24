package model.rdf.sparql.rgml.query

import model.rdf.sparql.query.SparqlQuery

class NodesQuery(maybeOffset: Option[Integer] = None, maybeLimit: Option[Integer] = None) extends SparqlQuery {

  def get: String = {
    val offsetClause = maybeOffset match {
      case Some(offset) => "OFFSET " + offset
      case None => ""
    }
    val limitClause = maybeLimit match {
      case Some(limit) => "LIMIT " + limit
      case None => ""
    }

    """
		  | PREFIX rgml: <http://purl.org/puninj/2001/05/rgml-schema#>
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		  | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      |
      | CONSTRUCT {
      |	  ?node	rdf:type rgml:Node ;
      |     rdfs:label ?label ;
      |     .
      |	}
      |	WHERE {
      |   SELECT ?node ?label
      |   WHERE {
      |	    ?node	rdf:type rgml:Node .
      |     OPTIONAL { ?node rdfs:label ?label }
      |   }
      |   GROUP BY ?node ?label
      |
      |   @offset
      |   @limit
      |	}
    """
      .stripMargin
      .replace("@offset", offsetClause)
      .replace("@limit", limitClause)
  }
}
