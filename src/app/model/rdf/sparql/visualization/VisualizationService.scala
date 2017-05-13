package model.rdf.sparql.visualization

import model.entity.{VisualizerTemplate, PipelineEvaluation}
import model.rdf.LocalizedValue
import model.service.component.DataReference
import play.api.db.slick._

trait VisualizationService {

  def dataReferences(evaluation: PipelineEvaluation)(implicit session: Session): Seq[DataReference]

  def getLabels(uri: String) : Option[LocalizedValue]

  def getLabels(evaluation: PipelineEvaluation, uri: String): Option[LocalizedValue]

  def getComments(uri: String): Option[LocalizedValue]

  def getComments(evaluation: PipelineEvaluation, uri: String): Option[LocalizedValue]

  def skosScheme(evaluation: PipelineEvaluation, schemeUri: String): Option[HierarchyNode]

  def skosSchemes(evaluation: PipelineEvaluation, tolerant: Boolean)(implicit session: Session): Option[Seq[Scheme]]

  def skosConcepts(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Concept]]

  def skosConcepts(evaluation: PipelineEvaluation, uris: Seq[String])(implicit session: Session): Map[String, Option[Seq[Concept]]]

  def skosConceptsCounts(evaluation: PipelineEvaluation, propertyUri: String, values: Seq[String])(implicit session: Session): Map[String, Option[Int]]

}
