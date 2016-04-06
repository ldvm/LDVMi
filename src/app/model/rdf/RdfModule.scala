package model.rdf

import model.rdf.sparql.visualization.{VisualizationService, VisualizationServiceImpl}
import model.service.DataSourceService
import model.service.impl.DataSourceServiceImpl
import model.service.ldvm.extractor.{ComponentExtractor, PipelineExtractor}
import scaldi.Module
import model.rdf.sparql.datacube.{DataCubeService, DataCubeServiceImpl}
import model.rdf.sparql.geo.{GeoService, GeoServiceImpl}
import model.rdf.sparql.rgml.{RgmlService, RgmlServiceImpl}
import model.rdf.sparql.{SparqlEndpointService, SparqlEndpointServiceImpl}

class RdfModule extends Module {
  bind [SparqlEndpointService] to new SparqlEndpointServiceImpl
  bind [DataCubeService] to new DataCubeServiceImpl
  bind [VisualizationService] to new VisualizationServiceImpl
  bind [GeoService] to new GeoServiceImpl
  bind [RgmlService] to new RgmlServiceImpl

  bind [PipelineExtractor] to new PipelineExtractor
  bind [ComponentExtractor] to new ComponentExtractor

  bind [DataSourceService] to new DataSourceServiceImpl
}
