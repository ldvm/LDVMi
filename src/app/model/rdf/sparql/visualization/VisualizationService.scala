package model.rdf.sparql.visualization

import model.entity.PipelineEvaluation
import play.api.libs.iteratee.Enumerator
import play.api.libs.json.JsValue

trait VisualizationService {

  def hierarchy(evaluation: PipelineEvaluation): Option[HierarchyNode]

}
