package model.rdf.sparql.fresnel

import model.entity.PipelineEvaluation
import model.rdf.sparql.fresnel.extractor.LensesByPurposeExtractor
import model.rdf.sparql.fresnel.query.LensesByPurposeQuery
import model.rdf.sparql.rgml.extractor.{EdgesExtractor, GraphExtractor}
import model.rdf.sparql.rgml.query.{EdgesQuery, GraphQuery}
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

import scala.collection.mutable

class FresnelServiceImpl(implicit val inj: Injector) extends FresnelService with Injectable {
  var sparqlEndpointService = inject[SparqlEndpointService]

  override def lensesByPurpose(evaluation: PipelineEvaluation, purpose: String, isUri: Boolean = false)(implicit session: Session): Option[Seq[Lens]] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new LensesByPurposeQuery(purpose, isUri),
      new LensesByPurposeExtractor())
  }

  private def evaluationToSparqlEndpoint(evaluation: PipelineEvaluation)(implicit session: Session): GenericSparqlEndpoint = {
    val evaluationResults = evaluation.results
    evaluationResults.map { result =>
      new GenericSparqlEndpoint(result.endpointUrl, List(), result.graphUri.map(_.split("\n").toSeq).getOrElse(Seq()))
    }.head
  }
}
