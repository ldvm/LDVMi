package model.rdf.sparql.query


class LabelsDereferenceQuery(val uri: String) extends SparqlQuery {

  def get: String =
    s"""
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      | PREFIX schema: <http://schema.org/>
      |
      | SELECT DISTINCT ?o ?l ?spl ?sn ?sna ?st
      | WHERE {
      |     OPTIONAL { <$uri> skos:prefLabel ?spl . }
      |     OPTIONAL { <$uri> rdfs:label ?l . }
      |     OPTIONAL { <$uri> schema:name ?sna . }
      |     OPTIONAL { <$uri> schema:title ?st . }
      |     OPTIONAL { <$uri> skos:notation ?sn . }
      | }
    """.stripMargin.replaceAll("[\n\r]", "")

}


