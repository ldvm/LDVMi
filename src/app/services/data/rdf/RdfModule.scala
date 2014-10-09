package services.data.rdf

import scaldi.Module
import services.data.rdf.sparql.datacube.{DataCubeService, DataCubeServiceImpl}
import services.data.rdf.sparql.geo.{GeoServiceImpl, GeoService}
import services.data.rdf.sparql.{SparqlEndpointService, SparqlEndpointServiceImpl}

class RdfModule extends Module {
  bind [SparqlEndpointService] to new SparqlEndpointServiceImpl
  bind [DataCubeService] to new DataCubeServiceImpl
  bind [GeoService] to new GeoServiceImpl
}
