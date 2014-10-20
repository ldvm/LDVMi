package model.services.rdf.sparql.geo

import model.dao.DataSource
import play.api.libs.iteratee.Enumerator
import model.services.rdf.Property

trait GeoService {

  def polygonEntities(dataSource: DataSource, queryData: WKTQueryData): Enumerator[Option[WKTEntity]]

  def polygonEntitiesProperties(dataSource: DataSource): Enumerator[Option[Property]]

}
