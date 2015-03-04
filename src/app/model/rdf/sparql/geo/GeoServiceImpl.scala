package model.rdf.sparql.geo

import model.entity.{PipelineEvaluation, DataSourceTemplate, DataSourceTemplateEagerBox}
import model.rdf.Property
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}
import model.rdf.sparql.geo.extractor.{PolygonEntitiesPropertiesExtractor, WKTEntitiesExtractor}
import model.rdf.sparql.geo.query.{PolygonEntitiesPropertiesQuery, WKTEntitiesQuery}
import play.api.libs.iteratee.Enumerator
import scaldi.{Injectable, Injector}
import _root_.model.service.Connected

class GeoServiceImpl(implicit val inj: Injector) extends GeoService with Connected with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def polygonEntities(evaluation: PipelineEvaluation, queryData: WKTQueryData): Option[Enumerator[Option[WKTEntity]]] = {
    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new WKTEntitiesQuery(queryData), new WKTEntitiesExtractor(queryData))
  }

  def polygonEntitiesProperties(evaluation: PipelineEvaluation): Option[Enumerator[Option[Property]]] = {
    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new PolygonEntitiesPropertiesQuery, new PolygonEntitiesPropertiesExtractor)
  }

  private def evaluationToSparqlEndpoint(evaluation: PipelineEvaluation) : GenericSparqlEndpoint = {
    withSession { implicit session =>
      val evaluationResults = evaluation.results
      evaluationResults.map { result => new GenericSparqlEndpoint(result.endpointUrl, List(), result.graphUri.toSeq) }.head
    }
  }
}
