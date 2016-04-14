package model.rdf.sparql.rgml.query

import model.rdf.sparql.query.SparqlQuery
import model.rdf.sparql.rgml.Graph

class RelatedNodesQuery(graph: Graph, nodeUri: String) extends SparqlQuery {

  def get: String = {
    val where = if (graph.directed)
      """
        | ?edge
        |   rgml:source <@n> ;
        |   rgml:target ?node
      """.stripMargin
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
      |
      | SELECT ?node
      | WHERE {
      |   ?node rdf:type rgml:Node .
      |   @w
      | }
      | GROUP BY ?node
    """
      .stripMargin
      .replace("@w", where)
      .replace("@n", nodeUri)
  }
}
