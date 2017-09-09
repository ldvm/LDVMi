package model.rdf.sparql.visualization

import _root_.model.service.SessionScoped
import model.entity.PipelineEvaluation
import model.rdf.LocalizedValue
import model.rdf.extractor.{CommentsExtractor, LabelsExtractor}
import model.rdf.sparql.query.{CommentsQuery, LabelsDereferenceQuery}
import model.rdf.sparql.visualization.extractor.{ConceptCountExtractor, ConceptsExtractor, SchemeExtractor, SchemesExtractor}
import model.rdf.sparql.visualization.query._
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}
import model.service.component.DataReference
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class VisualizationServiceImpl(implicit val inj: Injector) extends VisualizationService with SessionScoped with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def skosScheme(evaluation: PipelineEvaluation, schemeUri: String): Option[HierarchyNode] = {
    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new SchemeQuery(schemeUri), new SchemeExtractor(schemeUri))
  }

  def dataReferences(evaluation: PipelineEvaluation)(implicit session: Session): Seq[DataReference] = {
    evaluation.results.map { r =>
      val uris = r.graphUri.map(_.split("\n").toSeq).getOrElse(Seq())
      DataReference(r.port.uri, r.endpointUrl, uris)
    }
  }

  def skosSchemes(evaluation: PipelineEvaluation, tolerant: Boolean)(implicit session: Session): Option[Seq[Scheme]] = {

    val query = if (tolerant) {
      new SchemesTolerantQuery
    } else {
      new SchemesQuery
    }

    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), query, new SchemesExtractor)
  }

  def skosConcepts(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Concept]] = {
    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new ConceptsQuery, new ConceptsExtractor)
  }

  def skosConcepts(evaluation: PipelineEvaluation, uris: Seq[String])(implicit session: Session): Map[String, Option[Seq[Concept]]] = {
    uris.map { u =>
      u -> sparqlEndpointService
        .getResult(evaluationToSparqlEndpoint(evaluation), new ConceptsBySchemaQuery(u), new ConceptsExtractor)
    }.toMap
  }

  def skosConceptsCounts(evaluation: PipelineEvaluation, propertyUri: String, values: Seq[String])(implicit session: Session): Map[String, Option[Int]] = {
    values.map { u =>
      u -> sparqlEndpointService
        .getResult(evaluationToSparqlEndpoint(evaluation), new ConceptCountQuery(propertyUri, u), new ConceptCountExtractor)
    }.toMap
  }

  def getLabels(uri: String): Option[LocalizedValue] = {
    sparqlEndpointService.dereference(uri, new LabelsDereferenceQuery(uri), new LabelsExtractor)
  }

  def getLabels(evaluation: PipelineEvaluation, uri: String): Option[LocalizedValue] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new LabelsDereferenceQuery(uri),
      new LabelsExtractor)
  }

  def getComments(uri: String): Option[LocalizedValue] = {
    sparqlEndpointService.dereference(uri, new CommentsQuery(uri), new CommentsExtractor)
  }

  def getComments(evaluation: PipelineEvaluation, uri: String): Option[LocalizedValue] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new CommentsQuery(uri),
      new CommentsExtractor)
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