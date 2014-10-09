package services.data.rdf.sparql.geo.query

import services.data.rdf.sparql.query.SparqlQuery


class PolygonEntitiesQuery extends SparqlQuery {

  def get: String = prefixes +
    """
      | CONSTRUCT {
      |   ?e ?x ?p
      | } WHERE {
      |   ?e ?x ?p
      | }
    """.stripMargin

  private def prefixes =
    """
      |

    """.stripMargin

}
