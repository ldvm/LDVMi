package model.services.rdf

import scaldi.Module
import model.services.rdf.sparql.datacube.{DataCubeService, DataCubeServiceImpl}
import model.services.rdf.sparql.geo.{GeoServiceImpl, GeoService}
import model.services.rdf.sparql.{SparqlEndpointService, SparqlEndpointServiceImpl}

class RdfModule extends Module {
  bind [SparqlEndpointService] to new SparqlEndpointServiceImpl
  bind [DataCubeService] to new DataCubeServiceImpl
  bind [GeoService] to new GeoServiceImpl
}
