package model.rdf.sparql.rgml.query

import model.rdf.sparql.query.SparqlQuery
import model.rdf.sparql.rgml.Graph
import model.rdf.sparql.rgml.EdgeDirection._

class RelatedNodesQuery(graph: Graph, nodeUri: String, direction: EdgeDirection = Outgoing) extends NodesQuery {

  override def get: String = {
    val where = if (graph.directed)
      direction match {
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
    else
      """
        | {
        |   ?edge
        |     rgml:source <@n> ;
        |     rgml:target ?node
        | }
        | UNION
        | {
        |   ?edge
        |     rgml:source ?node ;
        |     rgml:target <@n>
        | }
      """.stripMargin


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
