package model.rdf.sparql.rgml.query

import model.rdf.sparql.rgml.EdgeDirection._
import model.rdf.sparql.rgml.Graph

class IncidentEdgesQuery(graph: Graph, nodeUri: String, direction: EdgeDirection = Outgoing) extends EdgesQuery {

  override def get: String = {
    val where = if (graph.directed)
      direction match {
        case Outgoing =>
          """
            | FILTER(?source = <@n>)
          """.stripMargin
        case Incoming =>
          """
            | FILTER(?target = <@n>)
          """.stripMargin
      }
    else
      """
        | FILTER(?source = <@n> || ?target = <@n>)
      """.stripMargin

    """
      | PREFIX rgml: <http://purl.org/puninj/2001/05/rgml-schema#>
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      |
      | CONSTRUCT {
      |	  ?edge rdf:type rgml:Edge ;
      |     rgml:source ?source ;
      |     rgml:target ?target ;
      |     rgml:weight ?weight ;
      |     .
      |	}
      | WHERE {
      |   SELECT DISTINCT ?edge ?source ?target ?weight
      |   WHERE {
      |     ?edge rdf:type rgml:Edge ;
      |       rgml:source ?source ;
      |       rgml:target ?target ;
      |       rgml:weight ?weight ;
      |       .
      |
      |     @w
      |   }
      | }
    """
      .stripMargin
      .replace("@w", where)
      .replace("@n", nodeUri)
  }
}
