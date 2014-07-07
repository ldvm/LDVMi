package services.data.rdf.sparql

trait SparqlEndpointService {

  def queryEndpoint(endpointUrl: String, sparqlQuery: String) : Option[com.hp.hpl.jena.query.Dataset]

}
