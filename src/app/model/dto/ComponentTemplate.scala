package model.dto

import com.hp.hpl.jena.rdf.model.Model

case class ComponentTemplate(
  uri: String,
  label: Option[String],
  comment: Option[String],
  configuration: Option[Model],
  inputTemplates: Seq[InputTemplate],
  outputTemplate: Option[OutputTemplate],
  nestedMembers: Seq[ConcreteComponentInstance],
  features: Seq[Feature]
)
