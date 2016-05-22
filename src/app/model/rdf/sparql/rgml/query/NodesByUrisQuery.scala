package model.rdf.sparql.rgml.query

class NodesByUrisQuery(uris: Seq[String]) extends NodesQuery {

  override def get: String = {
    val nodes = uris.map(uris => "<" + uris + ">").mkString(" ")

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
      |     VALUES ?node { @nodes }
      |	    ?node rdf:type rgml:Node .
      |     OPTIONAL { ?node rdfs:label ?label }
      |   }
      |   GROUP BY ?node ?label
      |	}
    """
      .stripMargin
      .replace("@nodes", nodes)
  }
}
