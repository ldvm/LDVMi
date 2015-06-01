package model.rdf.sparql.visualization

import _root_.model.service.SessionScoped
import model.entity.PipelineEvaluation
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}
import model.rdf.sparql.visualization.extractor.{SchemesExtractor, ConceptsExtractor, HierarchyExtractor}
import model.rdf.sparql.visualization.query.{SchemesQuery, ConceptsQuery, HierarchyQuery}
import model.service.component.DataReference
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class VisualizationServiceImpl(implicit val inj: Injector) extends VisualizationService with SessionScoped with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def hierarchy(evaluation: PipelineEvaluation, schemeUri: String): Option[HierarchyNode] = {
    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new HierarchyQuery(schemeUri), new HierarchyExtractor)
  }

  def dataReferences(evaluation: PipelineEvaluation)(implicit session: Session): Seq[DataReference] = {
    evaluation.results.map { r =>
      val uris = r.graphUri.map(_.split("\n").toSeq).getOrElse(Seq())
      DataReference(r.port.uri, r.endpointUrl, uris)
    }
  }

  def skosSchemes(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Scheme]] = {
    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new SchemesQuery, new SchemesExtractor)
  }

  def skosConcepts(evaluation: PipelineEvaluation, uris: Seq[String])(implicit session: Session): Map[String, Option[Seq[Concept]]] = {
    uris.map { u =>
      u -> sparqlEndpointService
        .getResult(evaluationToSparqlEndpoint(evaluation), new ConceptsQuery(u), new ConceptsExtractor)
    }.toMap
  }

  private def evaluationToSparqlEndpoint(evaluation: PipelineEvaluation): GenericSparqlEndpoint = {
    withSession { implicit session =>
      val evaluationResults = evaluation.results
      evaluationResults.map { result =>
        new GenericSparqlEndpoint(result.endpointUrl, List(), result.graphUri.map(_.split("\n").toSeq).getOrElse(Seq()))
      }.head
    }
  }
}