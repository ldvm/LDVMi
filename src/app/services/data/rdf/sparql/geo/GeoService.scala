package services.data.rdf.sparql.geo

import data.models.DataSource

trait GeoService {

  def polygonEntities(dataSource: DataSource): Seq[PolygonEntity]

}
