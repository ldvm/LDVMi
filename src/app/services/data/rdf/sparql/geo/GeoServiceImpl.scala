package services.data.rdf.sparql.geo

import data.models.DataSource
import scaldi.{Injector, Injectable}
import services.data.rdf.sparql.SparqlEndpointService
import services.data.rdf.sparql.geo.extractor.PolygonEntitiesExtractor
import services.data.rdf.sparql.geo.query.PolygonEntitiesQuery

class GeoServiceImpl(implicit val inj: Injector) extends GeoService with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def polygonEntities(dataSource: DataSource): Seq[PolygonEntity] = {
    sparqlEndpointService.getSparqlQueryResult(dataSource, new PolygonEntitiesQuery, new PolygonEntitiesExtractor)
  }

}
