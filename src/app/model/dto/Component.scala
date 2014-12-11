package model.dto

import com.hp.hpl.jena.rdf.model.Model

case class Component(
  uri: String,
  label: Option[String],
  comment: Option[String],
  configuration: Option[Model],
  inputs: Seq[Input],
  output: Option[Output],
  features: Seq[Feature]
)
