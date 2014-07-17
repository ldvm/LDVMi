package services.data.rdf.sparql.datacube.query

import services.data.rdf.sparql.query.SparqlQuery


class DataCubeValuesQuery(uri: String) extends SparqlQuery {

  def get: String =
    """
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      |
      | SELECT DISTINCT ?o ?l ?spl ?sn WHERE {
      |     [] <%s> ?o .
      |
      |     OPTIONAL { ?o skos:prefLabel ?spl . }
      |     OPTIONAL { ?o rdfs:label ?l . }
      |     OPTIONAL { ?o skos:notion ?sn . }
      | }
    """.stripMargin.replaceAll("[\n\r]","").replace("%s", uri)

}
