package model.rdf.sparql.geo

import model.entity.{DataSourceEagerBox, DataSource}
import play.api.libs.iteratee.Enumerator
import model.rdf.Property

trait GeoService {

  def polygonEntities(dataSourceEagerBox: DataSourceEagerBox, queryData: WKTQueryData): Option[Enumerator[Option[WKTEntity]]]

  def polygonEntitiesProperties(dataSourceEagerBox: DataSourceEagerBox): Option[Enumerator[Option[Property]]]

}
