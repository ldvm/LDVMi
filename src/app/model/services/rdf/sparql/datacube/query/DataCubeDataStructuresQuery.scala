package model.services.rdf.sparql.datacube.query

import model.services.rdf.sparql.query.SparqlQuery


class DataCubeDataStructuresQuery extends SparqlQuery {

  def get: String =
    """
      | PREFIX qb: <http://purl.org/linked-data/cube#>
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      |
      | CONSTRUCT {
      |     ?d a qb:DataStructureDefinition ;
      |        rdfs:label ?l ;
      |        skos:prefLabel ?spl ;
      |        skos:notion ?sn .
      | } WHERE
      | {
      |    ?d a qb:DataStructureDefinition .
      |    OPTIONAL { ?d skos:prefLabel ?spl . }
      |    OPTIONAL { ?d rdfs:label ?l . }
      |    OPTIONAL { ?d skos:notion ?sn . }
      | }
    """.stripMargin.replaceAll("[\n\r]", "")

}
