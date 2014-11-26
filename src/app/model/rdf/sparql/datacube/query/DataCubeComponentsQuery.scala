package model.rdf.sparql.datacube.query

import model.rdf.sparql.query.SparqlQuery


class DataCubeComponentsQuery(dataStructureUri: String, componentType: String = "dimension") extends SparqlQuery {

  def get: String = """
                      | PREFIX qb: <http://purl.org/linked-data/cube#>
                      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                      |
                      | CONSTRUCT {
                      |     <@s> a qb:DataStructureDefinition ;
                      |        qb:component ?c .
                      |     ?c qb:@t ?dim ;
                      |        rdfs:label ?l ;
                      |        skos:notion ?sn ;
                      |        skos:prefLabel ?spl ;
                      |        qb:order ?order ;
                      |        qb:concept ?concept .
                      | } WHERE
                      |  { {
                      |       <@s> a qb:DataStructureDefinition .
                      |       <@s> qb:component ?c .
                      |       ?c qb:@t ?dim .
                      |    }
                      |    OPTIONAL { ?dim qb:concept ?concept . }
                      |    OPTIONAL { ?c qb:order ?order . }
                      |    OPTIONAL { ?c skos:prefLabel ?spl . }
                      |    OPTIONAL { ?c rdfs:label ?l . }
                      |    OPTIONAL { ?c skos:notion ?sn . }
                      |  }
                    """.stripMargin
    .replaceAll("@s", dataStructureUri)
    .replaceAll("@t", componentType)
    .replaceAll("[\n\r]", "")

}
