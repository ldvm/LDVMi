package model.rdf.sparql.geo

import model.entity.{DataSourceTemplateEagerBox, DataSourceTemplate}
import play.api.libs.iteratee.Enumerator
import model.rdf.Property

trait GeoService {

  def polygonEntities(dataSourceEagerBox: DataSourceTemplateEagerBox, queryData: WKTQueryData): Option[Enumerator[Option[WKTEntity]]]

  def polygonEntitiesProperties(dataSourceEagerBox: DataSourceTemplateEagerBox): Option[Enumerator[Option[Property]]]

}
