package model.rdf.sparql.timeline

import java.util.Date

import model.entity.PipelineEvaluation
import model.rdf.Count
import model.rdf.sparql.extractor.CountExtractor
import model.rdf.sparql.timeline.query._
import model.rdf.sparql.{EvaluationToSparqlEndpoint, SparqlEndpointService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class TimeLineCountServiceImpl(implicit val inj: Injector) extends TimeLineCountService with Injectable with EvaluationToSparqlEndpoint {
  var sparqlEndpointService = inject[SparqlEndpointService]

  override def intervals(evaluation: PipelineEvaluation, start: Date, end: Date, urls: Seq[String], limit: Int)(implicit session: Session): Option[Count] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeUrl = if (urls.nonEmpty) Some(urls) else None
    sparqlEndpointService.getCount(
      evaluationToSparqlEndpoint(evaluation),
      new IntervalQuery(Some(start), Some(end), maybeUrl, maybeLimit),
      new CountExtractor())
  }

  override def instants(evaluation: PipelineEvaluation, start: Date, end: Date, urls: Seq[String], limit: Int)(implicit session: Session): Option[Count] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeUrl = if (urls.nonEmpty) Some(urls) else None
    sparqlEndpointService.getCount(
      evaluationToSparqlEndpoint(evaluation),
      new InstantQuery(Some(start), Some(end), maybeUrl, maybeLimit),
      new CountExtractor())
  }

  override def thingsWithIntervals(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Count] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeThingUrls = if (thingUrls.nonEmpty) Some(thingUrls) else None
    val maybeThingTypes = if (thingTypes.nonEmpty) Some(thingTypes) else None
    val maybePredicates = if (predicates.nonEmpty) Some(predicates) else None
    sparqlEndpointService.getCount(
      evaluationToSparqlEndpoint(evaluation),
      new ThingsWithIntervalQuery(maybeThingUrls, maybeThingTypes, maybePredicates, maybeLimit),
      new CountExtractor())
  }

  override def thingsWithInstants(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Count] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeThingUrls = if (thingUrls.nonEmpty) Some(thingUrls) else None
    val maybeThingTypes = if (thingTypes.nonEmpty) Some(thingTypes) else None
    val maybePredicates = if (predicates.nonEmpty) Some(predicates) else None
    sparqlEndpointService.getCount(
      evaluationToSparqlEndpoint(evaluation),
      new ThingsWithInstantQuery(maybeThingUrls, maybeThingTypes, maybePredicates, maybeLimit),
      new CountExtractor())
  }

  override def thingsWithThingsWithIntervals(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Count] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeThingUrls = if (thingUrls.nonEmpty) Some(thingUrls) else None
    val maybeThingTypes = if (thingTypes.nonEmpty) Some(thingTypes) else None
    val maybePredicates = if (predicates.nonEmpty) Some(predicates) else None
    sparqlEndpointService.getCount(
      evaluationToSparqlEndpoint(evaluation),
      new ThingsWithThingsWithIntervalQuery(maybeThingUrls, maybeThingTypes, maybePredicates, maybeLimit),
      new CountExtractor())
  }

  override def thingsWithThingsWithInstants(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Count] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeThingUrls = if (thingUrls.nonEmpty) Some(thingUrls) else None
    val maybeThingTypes = if (thingTypes.nonEmpty) Some(thingTypes) else None
    val maybePredicates = if (predicates.nonEmpty) Some(predicates) else None
    sparqlEndpointService.getCount(
      evaluationToSparqlEndpoint(evaluation),
      new ThingsWithThingsWithInstantQuery(maybeThingUrls, maybeThingTypes, maybePredicates, maybeLimit),
      new CountExtractor())
  }
}
