package model.rdf.sparql.geo

import model.entity.{DataSourceTemplate, DataSourceTemplateEagerBox, PipelineEvaluation}
import model.rdf.{Property, SparqlService}
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}
import model.rdf.sparql.geo.extractor.{GeoPropertiesExtractor, MarkerExtractor, PolygonEntitiesPropertiesExtractor, WKTEntitiesExtractor}
import model.rdf.sparql.geo.query.{GeoPropertiesQuery, MarkerQuery, PolygonEntitiesPropertiesQuery, WKTEntitiesQuery}
import play.api.libs.iteratee.Enumerator
import scaldi.{Injectable, Injector}
import _root_.model.service.SessionScoped
import model.rdf.sparql.geo.models.{MapQueryData, Marker, WKTEntity}

class GeoServiceImpl(implicit val inj: Injector) extends GeoService with SessionScoped with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def polygonEntities(evaluation: PipelineEvaluation, queryData: MapQueryData): Option[Enumerator[Option[WKTEntity]]] = {
    runQuery(evaluation, new WKTEntitiesQuery(queryData), new WKTEntitiesExtractor(queryData))()
  }

  def markers(evaluation: PipelineEvaluation, queryData: MapQueryData): Option[Seq[Marker]] = {
    runQuery(evaluation, new MarkerQuery(queryData), new MarkerExtractor(queryData))()
  }

  def polygonEntitiesProperties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]] = {
    runQuery(evaluation, new PolygonEntitiesPropertiesQuery, new PolygonEntitiesPropertiesExtractor)()
  }

  def properties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]] = {
    runQuery(evaluation, new GeoPropertiesQuery, new GeoPropertiesExtractor)()
  }
}
