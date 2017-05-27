package model.rdf

import model.rdf.sparql.datacube.{DataCubeService, DataCubeServiceImpl}
import model.rdf.sparql.fresnel.{FresnelService, FresnelServiceImpl}
import model.rdf.sparql.geo.{GeoCountService, GeoCountServiceImpl, GeoService, GeoServiceImpl}
import model.rdf.sparql.rgml.{RgmlService, RgmlServiceImpl}
import model.rdf.sparql.timeline.{TimeLineCountService, TimeLineCountServiceImpl, TimeLineService, TimeLineServiceImpl}
import model.rdf.sparql.visualization.{VisualizationService, VisualizationServiceImpl}
import model.rdf.sparql.{SparqlEndpointService, SparqlEndpointServiceImpl}
import model.service.DataSourceService
import model.service.impl.DataSourceServiceImpl
import model.service.ldvm.extractor.{ComponentExtractor, PipelineExtractor}
import scaldi.Module

class RdfModule extends Module {
  bind[SparqlEndpointService] to new SparqlEndpointServiceImpl
  bind[DataCubeService] to new DataCubeServiceImpl
  bind[VisualizationService] to new VisualizationServiceImpl
  bind[GeoService] to new GeoServiceImpl
  bind[GeoCountService] to new GeoCountServiceImpl
  bind[RgmlService] to new RgmlServiceImpl
  bind[TimeLineService] to new TimeLineServiceImpl
  bind[TimeLineCountService] to new TimeLineCountServiceImpl
  bind[FresnelService] to new FresnelServiceImpl

  bind[PipelineExtractor] to new PipelineExtractor
  bind[ComponentExtractor] to new ComponentExtractor

  bind[DataSourceService] to new DataSourceServiceImpl
}
