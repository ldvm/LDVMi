package model.rdf.sparql.visualization

import _root_.model.service.SessionScoped
import model.entity.PipelineEvaluation
import model.rdf.sparql.datacube.extractor._
import model.rdf.sparql.datacube.query._
import model.rdf.sparql.visualization.extractor.HierarchyExtractor
import model.rdf.sparql.visualization.query.HierarchyQuery
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpoint, SparqlEndpointService, ValueFilter}
import play.api.libs.iteratee.Enumerator
import play.api.libs.json.JsValue
import scaldi.{Injectable, Injector}
import utils.MD5

class VisualizationServiceImpl(implicit val inj: Injector) extends VisualizationService with SessionScoped with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def hierarchy(evaluation: PipelineEvaluation): Option[Seq[HierarchyNode]] = {
    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new HierarchyQuery, new HierarchyExtractor)
  }

  private def evaluationToSparqlEndpoint(evaluation: PipelineEvaluation): GenericSparqlEndpoint = {
    withSession { implicit session =>
      val evaluationResults = evaluation.results
      evaluationResults.map { result => new GenericSparqlEndpoint(result.endpointUrl, List(), result.graphUri.toSeq)}.head
    }
  }
}