package services.data.rdf.sparql.datacube.query

import services.data.rdf.sparql.SparqlQuery


class DataCubeDataStructuresQuery extends SparqlQuery {

  def get: String =
    """
      | PREFIX qb: <http://purl.org/linked-data/cube#>
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      |
      | CONSTRUCT {
      |     ?d a qb:DataStructureDefinition ;
      |        rdfs:label ?dsdLabel ;
      |        qb:component ?c ;
      |        qb:component ?c2 ;
      |        qb:component ?c3 .
      |     ?c qb:dimension ?dim ;
      |        rdfs:label ?l ;
      |        qb:order ?dimOrder ;
      |        qb:concept ?concept .
      |     ?c2 qb:measure ?m ;
      |         rdfs:label ?l2 ;
      |         qb:order ?mOrder .
      |     ?c3 qb:attribute ?a ;
      |         rdfs:label ?lattr ;
      |         qb:order ?aOrder .
      | } WHERE
      |  { {
      |    ?d a qb:DataStructureDefinition .
      |    ?d qb:component ?c .
      |    ?c qb:dimension ?dim .
      |    ?c rdfs:label ?l .
      |    ?c qb:order ?dimOrder .
      |    ?d qb:component ?c2 .
      |    ?c2 qb:measure ?m .
      |    ?c2 rdfs:label ?l2
      |    }
      |    OPTIONAL
      |      { ?m qb:order ?mOrder }
      |    OPTIONAL
      |      { ?d qb:component ?c3 .
      |        ?c3 qb:attribute ?a .
      |        ?c3 rdfs:label ?lattr .
      |        ?c3 qb:order ?aOrder
      |      }
      |    OPTIONAL
      |      { ?dim qb:concept ?concept }
      |    OPTIONAL
      |      { ?d rdfs:label ?dsdLabel
      |        FILTER ( lang(?dsdLabel) = "en" )
      |      }
      |  }
    """.stripMargin.replaceAll("[\n\r]","")

}
