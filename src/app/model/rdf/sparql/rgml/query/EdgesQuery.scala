package model.rdf.sparql.rgml.query

import model.rdf.sparql.query.SparqlQuery

class EdgesQuery extends SparqlQuery {

  def get: String =
    """
		  | PREFIX rgml: <http://purl.org/puninj/2001/05/rgml-schema#>
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      |
      |	CONSTRUCT {
      |	  ?edge	rdf:type rgml:Edge ;
      |			rgml:source ?source ;
      |			rgml:target ?target ;
      |     rgml:weight ?weight .
      |	}
      |	WHERE {
      |	  ?edge	rdf:type rgml:Edge ;
      |			rgml:source ?source ;
      |			rgml:target ?target ;
      |     rgml:weight ?weight .
      |	}
    """
      .stripMargin
}
