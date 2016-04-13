package model.rdf.sparql.fresnel

import model.entity.PipelineEvaluation
import play.api.db.slick.Session

trait FresnelService {
  def lensesByPurpose(evaluation: PipelineEvaluation, purpose: String, isUri: Boolean = false)(implicit session: Session): Option[Seq[Lens]]
  def resourcesThroughLens(evaluation: PipelineEvaluation, lens: Lens)(implicit session: Session): Option[Seq[ResourceThroughLens]]
  def searchThroughLens(evaluation: PipelineEvaluation, lens: Lens, needle: String)(implicit session: Session): Option[Seq[ResourceThroughLens]]
}
