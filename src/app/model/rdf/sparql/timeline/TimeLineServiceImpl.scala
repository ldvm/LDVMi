package model.rdf.sparql.timeline

import java.util.Date

import model.entity.PipelineEvaluation
import model.rdf.sparql.timeline.extractor._
import model.rdf.sparql.timeline.models.{Instant, Interval, TimeLineConnection}
import model.rdf.sparql.timeline.query._
import model.rdf.sparql.{EvaluationToSparqlEndpoint, SparqlEndpointService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class TimeLineServiceImpl(implicit val inj: Injector) extends TimeLineService with Injectable with EvaluationToSparqlEndpoint {
  var sparqlEndpointService = inject[SparqlEndpointService]

  override def intervals(evaluation: PipelineEvaluation, start: Date, end: Date, urls: Seq[String], limit: Int)(implicit session: Session): Option[Seq[Interval]] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeUrl = if (urls.size > 0) Some(urls) else None
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new IntervalQuery(Some(start), Some(end), maybeUrl, maybeLimit),
      new IntervalExtractor())
  }

  override def instants(evaluation: PipelineEvaluation, start: Date, end: Date, urls: Seq[String], limit: Int)(implicit session: Session): Option[Seq[Instant]] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeUrl = if (urls.size > 0) Some(urls) else None
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new InstantQuery(Some(start), Some(end), maybeUrl, maybeLimit),
      new InstantExtractor())
  }

  override def thingsWithIntervals(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Seq[TimeLineConnection]] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeThingUrls = if (thingUrls.size > 0) Some(thingUrls) else None
    val maybeThingTypes = if (thingTypes.size > 0) Some(thingTypes) else None
    val maybePredicates = if (predicates.size > 0) Some(predicates) else None

    val result = sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new ThingsWithIntervalQuery(maybeThingUrls, maybeThingTypes, maybePredicates, maybeLimit),
      new ThingToIntervalConnectionExtractor())
    return result;
  }

  override def thingsWithInstants(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Seq[TimeLineConnection]] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeThingUrls = if (thingUrls.size > 0) Some(thingUrls) else None
    val maybeThingTypes = if (thingTypes.size > 0) Some(thingTypes) else None
    val maybePredicates = if (predicates.size > 0) Some(predicates) else None
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new ThingsWithInstantQuery(maybeThingUrls, maybeThingTypes, maybePredicates, maybeLimit),
      new ThingToInstantConnectionExtractor())
  }

  override def thingsWithThingsWithIntervals(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Seq[TimeLineConnection]] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeThingUrls = if (thingUrls.size > 0) Some(thingUrls) else None
    val maybeThingTypes = if (thingTypes.size > 0) Some(thingTypes) else None
    val maybePredicates = if (predicates.size > 0) Some(predicates) else None
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new ThingsWithThingsWithIntervalQuery(maybeThingUrls, maybeThingTypes, maybePredicates, maybeLimit),
      new ThingToThingWithIntervalConnectionExtractor())
  }

  override def thingsWithThingsWithInstants(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Seq[TimeLineConnection]] = {
    val maybeLimit = if (limit > 0) Some(limit) else None
    val maybeThingUrls = if (thingUrls.size > 0) Some(thingUrls) else None
    val maybeThingTypes = if (thingTypes.size > 0) Some(thingTypes) else None
    val maybePredicates = if (predicates.size > 0) Some(predicates) else None
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new ThingsWithThingsWithInstantQuery(maybeThingUrls, maybeThingTypes, maybePredicates, maybeLimit),
      new ThingToThingWithInstantConnectionExtractor())
  }
}
