package model.rdf.sparql.geo

import model.entity.{DataSourceTemplate, DataSourceTemplateEagerBox, PipelineEvaluation}
import model.rdf.sparql.geo.models.{MapQueryData, Marker, WKTEntity}
import play.api.libs.iteratee.Enumerator
import model.rdf.{Property, SparqlService}

trait GeoService extends SparqlService {

  def polygonEntities(evaluation: PipelineEvaluation, queryData: MapQueryData): Option[Enumerator[Option[WKTEntity]]]

  def markers(evaluation: PipelineEvaluation, queryData: MapQueryData): Option[Seq[Marker]]

  def polygonEntitiesProperties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]]

  def properties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]]

}
