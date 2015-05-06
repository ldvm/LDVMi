package model.rdf.sparql.visualization

import model.entity.PipelineEvaluation
import model.service.component.DataReference
import play.api.db.slick._
import play.api.libs.iteratee.Enumerator
import play.api.libs.json.JsValue

trait VisualizationService {

  def hierarchy(evaluation: PipelineEvaluation): Option[Seq[HierarchyNode]]

  def dataReferences(evaluation: PipelineEvaluation)(implicit session: Session): Seq[DataReference]

}
