package model.rdf.sparql.geo

import model.entity.{PipelineEvaluation, DataSourceTemplateEagerBox, DataSourceTemplate}
import play.api.libs.iteratee.Enumerator
import model.rdf.{SparqlService, Property}

trait GeoService extends SparqlService {

  def polygonEntities(evaluation: PipelineEvaluation, queryData: MapQueryData): Option[Enumerator[Option[WKTEntity]]]

  def markers(evaluation: PipelineEvaluation, queryData: MapQueryData): Option[Seq[Marker]]

  def polygonEntitiesProperties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]]

  def properties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]]

}
