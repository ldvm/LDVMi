package services.data.rdf.sparql
import scaldi.{Injector}

class SparqlEndpointServiceImpl(implicit inj: Injector) extends SparqlEndpointService {

  def query(endpoint: SparqlEndpoint, query: SparqlQuery) : com.hp.hpl.jena.query.Dataset = {
    endpoint.executeQuery(query.get)
  }

}
