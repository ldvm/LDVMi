package model.rdf.sparql.visualization.query

class ConceptsBySchemaQuery(schemeUri: String) extends ConceptsQuery {

  override def get: String =
    s"""
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      |
      | CONSTRUCT {
      |   ?c a skos:Concept ;
      |      skos:inScheme <$schemeUri> ;
      |      skos:prefLabel ?l .
      | }
      | WHERE
      | {
      |   ?c a skos:Concept ;
      |      skos:inScheme <$schemeUri> ;
      |      skos:prefLabel ?l .
      | }
    """
      .stripMargin
}
