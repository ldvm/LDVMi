package controllers.api.dto

case class Feature(
  uri: String,
  title: Option[String],
  description: Option[String],
  isMandatory: Boolean,
  signatures: Seq[Signature]
)
