package model.rdf.sparql.chord

import model.entity.PipelineEvaluation
import play.api.db.slick.Session

trait ChordService {
  def edges(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Edge]]
  def matrix(evaluation: PipelineEvaluation)(implicit session: Session): Option[List[List[Int]]]
}
