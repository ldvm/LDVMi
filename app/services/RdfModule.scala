package services

import scaldi.Module
import services.data.rdf.sparql.{GenericSparqlEndpointService, SparqlEndpointService}

class RdfModule extends Module {
  bind [SparqlEndpointService] to new GenericSparqlEndpointService
}
