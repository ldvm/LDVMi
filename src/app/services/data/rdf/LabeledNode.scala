package services.data.rdf

trait LabeledNode {

  def title: Option[LocalizedLiteral]

  def label: Option[LocalizedLiteral]

  def comment: Option[LocalizedLiteral]

  def description: Option[LocalizedLiteral]

  def prefLabel: Option[LocalizedLiteral]

}
