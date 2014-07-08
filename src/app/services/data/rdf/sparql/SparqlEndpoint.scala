package services.data.rdf.sparql

trait SparqlEndpoint {
  def executeQuery(query: String) : com.hp.hpl.jena.query.Dataset
}
