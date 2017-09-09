package model.rdf.sparql.timeline

import java.util.Date
import model.entity.PipelineEvaluation
import model.rdf.sparql.timeline.models.{TimeLineConnection, Instant, Interval}
import play.api.db.slick.Session

trait TimeLineService {
  def intervals(evaluation: PipelineEvaluation, start: Date, end: Date, urls: Seq[String], limit: Int)(implicit session: Session): Option[Seq[Interval]]

  def instants(evaluation: PipelineEvaluation, start: Date, end: Date, urls: Seq[String], limit: Int)(implicit session: Session): Option[Seq[Instant]]

  def thingsWithIntervals(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Seq[TimeLineConnection]]

  def thingsWithInstants(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Seq[TimeLineConnection]]

  def thingsWithThingsWithIntervals(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Seq[TimeLineConnection]]

  def thingsWithThingsWithInstants(evaluation: PipelineEvaluation, thingUrls: Seq[String], thingTypes: Seq[String], predicates: Seq[String], limit: Int)(implicit session: Session): Option[Seq[TimeLineConnection]]

}
