package model.rdf.sparql.rgml

import model.entity.PipelineEvaluation
import play.api.db.slick.Session
import model.rdf.sparql.rgml.EdgeDirection._

trait RgmlService {
  def graph(evaluation: PipelineEvaluation)(implicit session: Session): Option[Graph]
  def nodes(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Node]]
  def nodes(evaluation: PipelineEvaluation, uris: Seq[String])(implicit session: Session): Option[Seq[Node]]
  def nodesWithDegree(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[NodeWithDegree]]
  def edges(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Edge]]
  def matrix(evaluation: PipelineEvaluation, nodeUris: Seq[String])(implicit session: Session): Option[Seq[Seq[Double]]]
  def incidentEdges(evaluation: PipelineEvaluation, nodeUri: String, direction: EdgeDirection = Outgoing)(implicit session: Session): Option[Seq[Edge]]
  def adjacentNodes(evaluation: PipelineEvaluation, nodeUri: String, direction: EdgeDirection = Outgoing)(implicit session: Session): Option[Seq[Node]]
}
