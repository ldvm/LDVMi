package model.rdf.sparql

import _root_.model.entity.PipelineEvaluation
import play.api.db.slick.Session

trait EvaluationToSparqlEndpoint {

  protected def evaluationToSparqlEndpoint(evaluation: PipelineEvaluation)(implicit session: Session): GenericSparqlEndpoint = {
    val evaluationResults = evaluation.results
    evaluationResults.map { result =>
      new GenericSparqlEndpoint(result.endpointUrl, List(), result.graphUri.map(_.split("\n").toSeq).getOrElse(Seq()))
    }.head
  }
}
