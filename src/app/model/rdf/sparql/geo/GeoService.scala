package model.rdf.sparql.geo

import model.entity.{PipelineEvaluation, DataSourceTemplateEagerBox, DataSourceTemplate}
import play.api.libs.iteratee.Enumerator
import model.rdf.Property

trait GeoService {

  def polygonEntities(evaluation: PipelineEvaluation, queryData: WKTQueryData): Option[Enumerator[Option[WKTEntity]]]

  def polygonEntitiesProperties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]]

}
