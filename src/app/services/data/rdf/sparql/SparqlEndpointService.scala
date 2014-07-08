package services.data.rdf.sparql

trait SparqlEndpointService {

  def query(endpoint: SparqlEndpoint, query: SparqlQuery) : com.hp.hpl.jena.query.Dataset

}
