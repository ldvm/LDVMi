package model.rdf.sparql.datacube.query

import model.rdf.sparql.query.SparqlQuery


class DataCubeComponentsQuery(datasetUri: String, componentType: String = "dimension", isTolerant: Boolean = false) extends SparqlQuery {

  def get: String = {

    val ctPattern = s"    qb:$componentType ?dim ."

    val componentTypeWhere = if(isTolerant) {
      s"OPTIONAL { ?c $ctPattern }"
    } else {
      "?c   " + ctPattern
    }

    val q = s"""
      | PREFIX qb: <http://purl.org/linked-data/cube#>
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      |
      | CONSTRUCT {
      |     <$datasetUri> qb:structure [
      |        a qb:DataStructureDefinition ;
      |        qb:component [
      |            qb:$componentType ?dim ;
      |            rdfs:label ?l ;
      |            skos:notion ?sn ;
      |            skos:prefLabel ?spl ;
      |            qb:order ?order ;
      |            qb:concept ?concept
      |        ]
      |     ] .
      | } WHERE
      |  { {
      |       <$datasetUri> qb:structure [
      |            qb:component ?c
      |       ] .
      |       $componentTypeWhere
      |    }
      |    OPTIONAL { ?dim qb:concept ?concept . }
      |    OPTIONAL { ?c qb:order ?order . }
      |    OPTIONAL { ?c skos:prefLabel ?spl . }
      |    OPTIONAL { ?c rdfs:label ?l . }
      |    OPTIONAL { ?c skos:notation ?sn . }
      |  }
    """.stripMargin
    println(q)
    q
  }

}
