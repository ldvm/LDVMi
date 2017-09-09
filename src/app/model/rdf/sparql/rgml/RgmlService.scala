package model.rdf.sparql.rgml

import model.entity.PipelineEvaluation
import play.api.db.slick.Session
import model.rdf.sparql.rgml.models._
import model.rdf.sparql.rgml.models.EdgeDirection._

trait RgmlService {
  def graph(evaluation: PipelineEvaluation)(implicit session: Session): Option[Graph]
  def nodes(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Node]]
  def nodes(evaluation: PipelineEvaluation, offset: Integer, limit: Integer)(implicit session: Session): Option[Seq[Node]]
  def nodes(evaluation: PipelineEvaluation, uris: Seq[String])(implicit session: Session): Option[Seq[Node]]
  def nodesWithDegree(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[NodeWithDegree]]
  def edges(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Edge]]
  def matrix(evaluation: PipelineEvaluation, nodeUris: Seq[String], useWeights: Boolean = true)(implicit session: Session): Option[Seq[Seq[Double]]]
  def incidentEdges(evaluation: PipelineEvaluation, nodeUri: String, direction: Option[EdgeDirection] = None)(implicit session: Session): Option[Seq[Edge]]
  def adjacentNodes(evaluation: PipelineEvaluation, nodeUri: String, direction: Option[EdgeDirection] = None)(implicit session: Session): Option[Seq[Node]]
  def sampleNodesByHighestDegree(evaluation: PipelineEvaluation, size: Int)(implicit session: Session): Option[Seq[Node]]
  def sampleNodesWithForestFire( evaluation: PipelineEvaluation, size: Int, useWeights: Boolean = true, pF: Double = 0.2, pB: Double = 0.05)(implicit session: Session): Option[Seq[Node]]
}
