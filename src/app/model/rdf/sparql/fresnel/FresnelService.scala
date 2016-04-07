package model.rdf.sparql.fresnel

import model.entity.PipelineEvaluation
import play.api.db.slick.Session

trait FresnelService {
  def lensesByPurpose(evaluation: PipelineEvaluation, purpose: String, isUri: Boolean = false)(implicit session: Session): Option[Seq[Lens]]
}
