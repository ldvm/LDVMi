package services

import scaldi.Module
import services.data.rdf.sparql.datacube.{DataCubeServiceImpl, DataCubeService}
import services.data.rdf.sparql.{SparqlEndpointServiceImpl, SparqlEndpointService}

class RdfModule extends Module {
  bind [SparqlEndpointService] to new SparqlEndpointServiceImpl
  bind [DataCubeService] to new DataCubeServiceImpl
}
