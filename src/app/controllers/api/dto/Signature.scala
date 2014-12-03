package controllers.api.dto

case class Signature(
  uri: String,
  title: Option[String],
  description: Option[String],
  query: String,
  appliesTo: Input
)
