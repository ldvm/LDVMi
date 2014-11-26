package model.rdf

trait LabeledNode extends Node {

  def title: Option[LocalizedValue]

  def label: Option[LocalizedValue]

  def comment: Option[LocalizedValue]

  def description: Option[LocalizedValue]

  def prefLabel: Option[LocalizedValue]

}
