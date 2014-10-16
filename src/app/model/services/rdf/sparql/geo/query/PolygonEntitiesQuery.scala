package model.services.rdf.sparql.geo.query

import model.services.rdf.sparql.query.SparqlQuery


class PolygonEntitiesQuery extends SparqlQuery {

  def get: String = prefixes +
    """
      | SELECT ?s ?p WHERE {
      |   ?s <http://www.opengis.net/ont/geosparql#hasGeometry> ?g .
      |   ?g <http://www.opengis.net/ont/geosparql#asWKT> ?p .
      | }
    """.stripMargin

  private def prefixes =
    """
      |

    """.stripMargin

}

object PolygonEntitiesQuery {

  object NodeVariables extends Enumeration {
    type NodeVariables = Value
    val geolocatedEntity = Value("s")
    val wkt = Value("p")
  }

}
