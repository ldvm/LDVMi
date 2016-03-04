package model.rdf.sparql.query


class LabelsDereferenceQuery(val uri: String) extends SparqlQuery {

  def get: String =
    s"""
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      | PREFIX schema: <http://schema.org/>
      | PREFIX dcterms: <http://purl.org/dc/terms/>
      |
      | SELECT DISTINCT ?l ?spl ?sn ?sna ?st
      | WHERE {
      |     OPTIONAL { <$uri> rdfs:label ?l . }
      |     OPTIONAL { <$uri> skos:prefLabel ?spl . }
      |     OPTIONAL { <$uri> skos:notation ?sn . }
      |     OPTIONAL { <$uri> schema:name ?sna . }
      |     OPTIONAL { <$uri> schema:title ?st . }
      |     OPTIONAL { <$uri> dcterms:title ?st . }
      | }
    """.stripMargin.replaceAll("[\n\r]", "")

}


