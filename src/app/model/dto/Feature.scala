package model.dto

case class Feature(
  uri: String,
  title: Option[String],
  description: Option[String],
  isMandatory: Boolean,
  descriptors: Seq[Descriptor]
)
