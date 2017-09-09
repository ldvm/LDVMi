package model.rdf.sparql.rgml.query

import model.rdf.sparql.rgml.models.EdgeDirection._

class IncidentEdgesQuery(nodeUri: String, direction: EdgeDirection) extends EdgesQuery {

  override def get: String = {
    val where = direction match {
      case Outgoing => "rgml:source <@n>"
      case Incoming => "rgml:target <@n>"
    }

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
      |       @w ;
      |       .
      |
      |   }
      | }
    """
      .stripMargin
      .replace("@w", where)
      .replace("@n", nodeUri)
  }
}
