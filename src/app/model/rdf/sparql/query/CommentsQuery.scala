package model.rdf.sparql.query

class CommentsQuery (val uri: String) extends SparqlQuery {

  def get: String =
    s"""
       | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
       | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
       | PREFIX dct: <http://purl.org/dc/terms/>
       |
       | SELECT DISTINCT ?rc ?dd ?sd ?sn
       | WHERE {
       |     OPTIONAL { <$uri> rdfs:comment ?rc . }
       |     OPTIONAL { <$uri> dct:description ?dd . }
       |     OPTIONAL { <$uri> skos:definition ?sd . }
       |     OPTIONAL { <$uri> skos:note ?sn . }
       | }
    """.stripMargin.replaceAll("[\n\r]", "")

}
