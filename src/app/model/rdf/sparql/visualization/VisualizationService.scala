package model.rdf.sparql.visualization

import model.entity.PipelineEvaluation
import model.service.component.DataReference
import play.api.db.slick._

trait VisualizationService {

  def hierarchy(evaluation: PipelineEvaluation): Option[Seq[HierarchyNode]]

  def dataReferences(evaluation: PipelineEvaluation)(implicit session: Session): Seq[DataReference]

  def skosConcepts(evaluation: PipelineEvaluation, uris: Seq[String])(implicit session: Session): Map[String, Option[Seq[Concept]]]

}
