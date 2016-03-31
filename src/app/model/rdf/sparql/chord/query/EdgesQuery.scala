package model.rdf.sparql.chord.query

import model.rdf.sparql.query.SparqlQuery

class EdgesQuery extends SparqlQuery {

  def get: String =
    """
      |	PREFIX chord: <http://linked.opendata.cz/ontology/chord/>
      |
      |	CONSTRUCT {
      |		_:node123
      |			chord:source ?source ;
      |			chord:target ?target .
      |	}
      |	WHERE
      | {
      |		?edge chord:source ?source .
      |		?edge chord:target ?target .
      |	}
    """
      .stripMargin
}
