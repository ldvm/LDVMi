package model.rdf.sparql.rgml.query

import model.rdf.sparql.rgml.models.EdgeDirection._
import model.rdf.sparql.rgml.models.Graph

class AdjacentNodesQuery(nodeUri: String, direction: EdgeDirection = Outgoing) extends NodesQuery {

  override def get: String = {
    val where = direction match {
        case Outgoing =>
          """
            | ?edge
            |   rgml:source <@n> ;
            |   rgml:target ?node
          """.stripMargin
        case Incoming =>
          """
            | ?edge
            |   rgml:target <@n> ;
            |   rgml:source ?node
          """.stripMargin
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
      | WHERE {
      |   SELECT ?node ?label
      |   WHERE {
      |     ?node rdf:type rgml:Node .
      |     OPTIONAL { ?node rdfs:label ?label }
      |     @w
      |   }
      |   GROUP BY ?node ?label
      | }
    """
      .stripMargin
      .replace("@w", where)
      .replace("@n", nodeUri)
  }
}
