package model.rdf.sparql.chord;

import model.entity.PipelineEvaluation
import model.rdf.sparql.chord.extractor.EdgesExtractor
import model.rdf.sparql.chord.query.EdgesQuery
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class ChordServiceImpl(implicit val inj: Injector) extends ChordService with Injectable {
  var sparqlEndpointService = inject[SparqlEndpointService]

  override def edges(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Edge]] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new EdgesQuery(),
      new EdgesExtractor())
  }

  private def evaluationToSparqlEndpoint(evaluation: PipelineEvaluation)(implicit session: Session): GenericSparqlEndpoint = {
      val evaluationResults = evaluation.results
      evaluationResults.map { result =>
        new GenericSparqlEndpoint(result.endpointUrl, List(), result.graphUri.map(_.split("\n").toSeq).getOrElse(Seq()))
      }.head
  }
}
