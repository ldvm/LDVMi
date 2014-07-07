package services.data.rdf.sparql

trait SparqlEndpoint {
  def executeQuery(query: String)
}
