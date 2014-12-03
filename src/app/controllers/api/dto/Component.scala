package controllers.api.dto

case class Component(
  uri: String,
  label: Option[String],
  comment: Option[String],
  configuration: Option[String],
  inputs: Seq[Input],
  output: Option[Output],
  features: Seq[Feature]
)
