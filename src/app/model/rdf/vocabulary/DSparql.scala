package model.rdf.vocabulary

object DSPARQL extends Vocabulary{

  override val PREFIX = "d-sparql"
  override val PREFIX_URL = "http://linked.opendata.cz/ontology/ldvm/datasource/sparql/"

  lazy val SparqlEndpointDataSourceConfiguration = m.createResource(PREFIX_URL + "SparqlEndpointDataSourceConfiguration")
  lazy val service = m.createProperty(PREFIX_URL, "service")
}
