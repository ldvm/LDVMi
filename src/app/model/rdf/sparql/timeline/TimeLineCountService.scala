package model.rdf.sparql.timeline

import java.util.Date

import model.entity.PipelineEvaluation
import model.rdf.Count
import play.api.db.slick.Session

trait TimeLineCountService {
  def intervals(evaluation: PipelineEvaluation, start: Date, end: Date, urls: Seq[String], limit: Int)(implicit session: Session): Option[Count]

  def instants(evaluation: PipelineEvaluation, start: Date, end: Date, urls: Seq[String], limit: Int)(implicit session: Session): Option[Count]

  def thingsWithIntervals(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Count]

  def thingsWithInstants(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Count]

  def thingsWithThingsWithIntervals(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Count]

  def thingsWithThingsWithInstants(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Count]
}
