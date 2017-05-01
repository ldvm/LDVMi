package model.rdf.sparql.rgml

import java.util.Date
import model.entity.PipelineEvaluation
import model.rdf.Count
import play.api.db.slick.Session

trait RgmlCountService {
  def intervals(evaluation: PipelineEvaluation, start: Date, end: Date, urls: Seq[String], limit: Int)(implicit session: Session): Option[Count]
  def instants(evaluation: PipelineEvaluation, start: Date, end: Date, urls: Seq[String], limit: Int)(implicit session: Session): Option[Count]
  def thingsWithIntervals(evaluation: PipelineEvaluation, thingUrls: Seq[String], connectionUrls: Seq[String], limit: Int)(implicit session: Session): Option[Count]
  def thingsWithInstants(evaluation: PipelineEvaluation, thingUrls: Seq[String], connectionUrls: Seq[String], limit: Int)(implicit session: Session): Option[Count]
  def thingsWithThingsWithIntervals(evaluation: PipelineEvaluation, thingUrls: Seq[String], connectionUrls: Seq[String], limit: Int)(implicit session: Session): Option[Count]
  def thingsWithThingsWithInstants(evaluation: PipelineEvaluation, thingUrls: Seq[String], connectionUrls: Seq[String], limit: Int)(implicit session: Session): Option[Count]
}
