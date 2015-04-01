package model.dto

case class Descriptor(
  uri: String,
  title: Option[String],
  description: Option[String],
  query: String,
  appliesTo: InputTemplate
)
