package model.rdf.sparql.fresnel

import model.entity.PipelineEvaluation
import model.rdf.LocalizedValue
import model.rdf.sparql.fresnel.extractor.{LensesByPurposeExtractor, ResourcesThroughLensExtractor}
import model.rdf.sparql.fresnel.query.{LensesByPurposeQuery, ResourcesThroughLensQuery}
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

  override def resourcesThroughLens(evaluation: PipelineEvaluation, lens: Lens)(implicit session: Session): Option[Seq[ResourceThroughLens]] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new ResourcesThroughLensQuery(lens),
      new ResourcesThroughLensExtractor(lens))
  }

  override def searchThroughLens(evaluation: PipelineEvaluation, lens: Lens, needle: String)(implicit session: Session): Option[Seq[ResourceThroughLens]] = {
    // Perform simple substring based search on the data loaded using given lens. A resource
    // is returned if any of its property values contains given needle. All the values are
    // considered to be potentially localized so we are searching through all language mutations.

    def normalize(value: String) = value.toUpperCase
    val normalizedNeedle = normalize(needle)

    def resourceMatches(resource: ResourceThroughLens) = {
      resource.properties.exists { case (_, value) => localizedValueMatches(value) }
    }

    def localizedValueMatches(localizedValue: LocalizedValue) = {
      LocalizedValue.unapply(localizedValue) match {
        case Some(values) => values.exists { case (_, value) => valueMatches(value) }
        case None => false
      }
    }

    def valueMatches(value: String) = normalize(value).contains(normalizedNeedle)

    resourcesThroughLens(evaluation, lens) map { resources =>
      resources.filter { resource => resourceMatches(resource) }
    }
  }
}
