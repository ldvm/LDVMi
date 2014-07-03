package services.data.rdf.sparql
import scaldi.{Injector}

class GenericSparqlEndpointService(implicit inj: Injector) extends SparqlEndpointService {

  def queryEndpoint(endpointUrl: String, sparqlQuery: String) : Option[com.hp.hpl.jena.query.Dataset] = {
    None
  }

}
