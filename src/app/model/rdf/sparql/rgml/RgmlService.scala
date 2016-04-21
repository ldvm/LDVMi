package model.rdf.sparql.rgml

import model.entity.PipelineEvaluation
import play.api.db.slick.Session

trait RgmlService {
  def graph(evaluation: PipelineEvaluation)(implicit session: Session): Option[Graph]
  def nodes(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Node]]
  def nodes(evaluation: PipelineEvaluation, uris: Seq[String])(implicit session: Session): Option[Seq[Node]]
  def edges(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Edge]]
  def matrix(evaluation: PipelineEvaluation, nodeUris: Seq[String])(implicit session: Session): Option[Seq[Seq[Double]]]
  def relatedNodes(evaluation: PipelineEvaluation, nodeUri: String)(implicit session: Session): Option[Seq[String]]
}
