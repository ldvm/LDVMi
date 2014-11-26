package model.rdf

import scaldi.Module
import model.rdf.sparql.datacube.{DataCubeService, DataCubeServiceImpl}
import model.rdf.sparql.geo.{GeoServiceImpl, GeoService}
import model.rdf.sparql.{SparqlEndpointService, SparqlEndpointServiceImpl}

class RdfModule extends Module {
  bind [SparqlEndpointService] to new SparqlEndpointServiceImpl
  bind [DataCubeService] to new DataCubeServiceImpl
  bind [GeoService] to new GeoServiceImpl
}
