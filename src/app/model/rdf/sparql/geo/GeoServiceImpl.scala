package model.rdf.sparql.geo

import model.entity.{DataSource, DataSourceEagerBox}
import model.rdf.Property
import model.rdf.sparql.SparqlEndpointService
import model.rdf.sparql.geo.extractor.{PolygonEntitiesPropertiesExtractor, WKTEntitiesExtractor}
import model.rdf.sparql.geo.query.{PolygonEntitiesPropertiesQuery, WKTEntitiesQuery}
import play.api.libs.iteratee.Enumerator
import scaldi.{Injectable, Injector}

class GeoServiceImpl(implicit val inj: Injector) extends GeoService with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def polygonEntities(dataSourceEagerBox: DataSourceEagerBox, queryData: WKTQueryData): Option[Enumerator[Option[WKTEntity]]] = {
    sparqlEndpointService.getResult(dataSourceEagerBox, new WKTEntitiesQuery(queryData), new WKTEntitiesExtractor(queryData))
  }

  def polygonEntitiesProperties(dataSourceEagerBox: DataSourceEagerBox): Option[Enumerator[Option[Property]]] = {
    sparqlEndpointService.getResult(dataSourceEagerBox, new PolygonEntitiesPropertiesQuery, new PolygonEntitiesPropertiesExtractor)
  }
}
