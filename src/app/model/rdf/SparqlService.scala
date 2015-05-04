package model.rdf

import _root_.model.entity.PipelineEvaluation
import _root_.model.service.SessionScoped
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.query.SparqlQuery
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}

trait SparqlService extends SessionScoped {

  def sparqlEndpointService: SparqlEndpointService

  def runQuery[Q <: SparqlQuery, R](
    pipelineEvaluation: PipelineEvaluation,
    query: Q,
    extractor: QueryExecutionResultExtractor[Q, R]
    )
    (sparqlEndpointSelector: PipelineEvaluation => GenericSparqlEndpoint = evaluationToSparqlEndpoint)
  : Option[R] = {

    sparqlEndpointService.getResult(sparqlEndpointSelector(pipelineEvaluation), query, extractor)

  }

  protected def evaluationToSparqlEndpoint(evaluation: PipelineEvaluation): GenericSparqlEndpoint = {
    withSession { implicit session =>
      val evaluationResults = evaluation.results
      evaluationResults.map { result => new GenericSparqlEndpoint(result.endpointUrl, List(), result.graphUri.map(_.split("\n")).toSeq.flatten) }.head
    }
  }

}
