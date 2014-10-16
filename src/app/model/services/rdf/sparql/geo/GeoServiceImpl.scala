package model.services.rdf.sparql.geo

import model.dao.DataSource
import play.api.libs.iteratee.Enumerator
import scaldi.{Injectable, Injector}
import model.services.rdf.Property
import model.services.rdf.sparql.SparqlEndpointService
import model.services.rdf.sparql.geo.extractor.{PolygonEntitiesExtractor, PolygonEntitiesPropertiesExtractor}
import model.services.rdf.sparql.geo.query.{PolygonEntitiesPropertiesQuery, PolygonEntitiesQuery}

class GeoServiceImpl(implicit val inj: Injector) extends GeoService with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def polygonEntities(dataSource: DataSource, queryData: PolygonQueryData): Enumerator[Option[WKTEntity]] = {
    sparqlEndpointService.getResult(dataSource, new PolygonEntitiesQuery(queryData), new PolygonEntitiesExtractor)
  }

  def polygonEntitiesProperties(dataSource: DataSource): Enumerator[Option[Property]] = {
    sparqlEndpointService.getResult(dataSource, new PolygonEntitiesPropertiesQuery, new PolygonEntitiesPropertiesExtractor)
  }

}
